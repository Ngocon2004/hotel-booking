'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { reviewSchema, type ReviewFormState } from '@/lib/validators/review'

async function getCurrentUserContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Ban can dang nhap')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return { supabase, user, isAdmin: profile?.role === 'admin' }
}

function getErrorText(error: unknown) {
  return error instanceof Error ? error.message : 'Thao tac that bai'
}

export async function createReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  try {
    const validated = reviewSchema.safeParse({
      booking_id: formData.get('booking_id'),
      rating: formData.get('rating'),
      comment: formData.get('comment'),
    })

    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors }
    }

    const { supabase, user } = await getCurrentUserContext()
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, customer_id, room_id, status')
      .eq('id', validated.data.booking_id)
      .single()

    if (bookingError || !booking) {
      throw new Error('Khong tim thay booking')
    }

    if (booking.customer_id !== user.id) {
      throw new Error('Khong co quyen danh gia booking nay')
    }

    if (booking.status !== 'checked_out') {
      throw new Error('Chi co the danh gia sau khi check-out')
    }

    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', booking.id)
      .eq('customer_id', user.id)
      .maybeSingle()

    if (existingReview) {
      throw new Error('Booking nay da duoc danh gia')
    }

    const { error } = await supabase.from('reviews').insert({
      booking_id: booking.id,
      customer_id: user.id,
      rating: validated.data.rating,
      comment: validated.data.comment || null,
    })

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath(`/my-bookings/${booking.id}`)
    revalidatePath(`/rooms/${booking.room_id}`)
    revalidatePath('/rooms')
    revalidatePath('/admin/reviews')

    return { success: true, message: 'Cam on ban da danh gia' }
  } catch (error) {
    return { errors: { _form: [getErrorText(error)] } }
  }
}

export async function deleteReview(reviewId: string) {
  const { supabase, isAdmin } = await getCurrentUserContext()

  if (!isAdmin) {
    throw new Error('Khong co quyen')
  }

  const { data: review, error: fetchError } = await supabase
    .from('reviews')
    .select('id, booking:bookings(room_id)')
    .eq('id', reviewId)
    .single()

  if (fetchError || !review) {
    throw new Error('Khong tim thay danh gia')
  }

  const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
  if (error) throw new Error(error.message)

  const roomId = (review.booking as { room_id?: string } | null)?.room_id
  revalidatePath('/admin/reviews')
  revalidatePath('/rooms')
  if (roomId) revalidatePath(`/rooms/${roomId}`)
}
