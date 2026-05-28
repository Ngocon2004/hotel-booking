'use server'

import { revalidatePath } from 'next/cache'
import { redirect, unstable_rethrow } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hoursUntilHotelDate } from '@/lib/utils/format'
import { createBookingSchema, type BookingFormState } from '@/lib/validators/booking'
import type { BookingStatus } from '@/types/database'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Có lỗi xảy ra'
}

export async function createBooking(
  roomId: string,
  _prev: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  let bookingCode = ''

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect(`/auth/login?redirect=/booking/${roomId}`)
    }

    const selectedServices = formData
      .getAll('services')
      .map((value) => String(value))
      .filter(Boolean)

    const validated = createBookingSchema.safeParse({
      room_id: roomId,
      check_in: formData.get('check_in'),
      check_out: formData.get('check_out'),
      guests: formData.get('guests'),
      special_requests: formData.get('special_requests') || undefined,
      services: selectedServices,
    })

    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors }
    }

    const input = validated.data
    const { data, error } = await supabase.rpc('create_booking_transaction', {
      p_room_id: input.room_id,
      p_check_in: input.check_in,
      p_check_out: input.check_out,
      p_guests: input.guests,
      p_special_requests: input.special_requests || null,
      p_service_ids: input.services,
    })

    if (error || !data) {
      return { errors: { _form: [error?.message || 'Không thể tạo booking'] } }
    }

    bookingCode = String(data)
  } catch (error) {
    unstable_rethrow(error)
    return { errors: { _form: [getErrorMessage(error)] } }
  }

  revalidatePath('/admin')
  revalidatePath('/rooms')
  redirect(`/booking/success/${bookingCode}`)
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('check_room_availability', {
    p_room_id: roomId,
    p_check_in: checkIn,
    p_check_out: checkOut,
  })

  if (error) {
    return { available: false, error: error.message }
  }

  return { available: Boolean(data) }
}

async function getCurrentUserContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Bạn cần đăng nhập')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return { supabase, user, isAdmin: profile?.role === 'admin' }
}

function getErrorText(error: unknown) {
  return error instanceof Error ? error.message : 'Thao tác thất bại'
}

export async function cancelBooking(bookingId: string) {
  try {
    const { supabase, user } = await getCurrentUserContext()
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('id, customer_id, status, check_in_date')
      .eq('id', bookingId)
      .single()

    if (fetchError || !booking) {
      throw new Error('Không tìm thấy booking')
    }

    if (booking.customer_id !== user.id) {
      throw new Error('Không có quyền hủy booking này')
    }

    const hoursUntilCheckIn = hoursUntilHotelDate(booking.check_in_date)

    if (booking.status !== 'pending' && hoursUntilCheckIn < 24) {
      throw new Error('Chỉ có thể hủy booking pending hoặc trước check-in ít nhất 24 giờ')
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)

    if (error) throw new Error(error.message)
  } catch (error) {
    return { error: getErrorText(error) }
  }

  revalidatePath('/my-bookings')
  revalidatePath(`/my-bookings/${bookingId}`)
  revalidatePath('/admin/bookings')
  return { success: true }
}

async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  paymentStatus?: 'unpaid' | 'paid' | 'refunded'
) {
  const { supabase, isAdmin } = await getCurrentUserContext()
  if (!isAdmin) {
    throw new Error('Không có quyền')
  }

  const updates: { status: BookingStatus; payment_status?: 'unpaid' | 'paid' | 'refunded' } = {
    status,
  }
  if (paymentStatus) updates.payment_status = paymentStatus

  const { error } = await supabase.from('bookings').update(updates).eq('id', bookingId)
  if (error) throw new Error(error.message)
}

export async function confirmBooking(bookingId: string) {
  try {
    await updateBookingStatus(bookingId, 'confirmed')
  } catch (error) {
    return { error: getErrorText(error) }
  }

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
  return { success: true }
}

export async function checkInBooking(bookingId: string) {
  try {
    await updateBookingStatus(bookingId, 'checked_in')
  } catch (error) {
    return { error: getErrorText(error) }
  }

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
  return { success: true }
}

export async function checkOutBooking(bookingId: string) {
  try {
    await updateBookingStatus(bookingId, 'checked_out', 'paid')
  } catch (error) {
    return { error: getErrorText(error) }
  }

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
  return { success: true }
}

export async function cancelBookingAdmin(bookingId: string) {
  try {
    await updateBookingStatus(bookingId, 'cancelled', 'refunded')
  } catch (error) {
    return { error: getErrorText(error) }
  }

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
  return { success: true }
}
