import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, CalendarDays, Mail, Phone, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import BookingActionButton from '@/components/bookings/booking-action-button'
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/bookings/status-badge'
import {
  cancelBookingAdmin,
  checkInBooking,
  checkOutBooking,
  confirmBooking,
} from '@/server/actions/bookings'
import { formatCurrency, formatDate, nightsBetween } from '@/lib/utils/format'
import type { BookingStatus, PaymentStatus } from '@/types/database'

type Params = Promise<{ id: string }>

type BookingDetail = {
  id: string
  booking_code: string
  check_in_date: string
  check_out_date: string
  total_guests: number
  total_price: number
  status: BookingStatus
  payment_status: PaymentStatus
  special_requests: string | null
  customer: {
    full_name: string | null
    phone: string | null
    id: string
  } | null
  room: {
    room_number: string
    room_type: {
      name: string
      base_price: number
    } | null
  } | null
}

export default async function AdminBookingDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('bookings')
    .select(
      `id, booking_code, check_in_date, check_out_date, total_guests, total_price, status, payment_status, special_requests,
      customer:profiles(id, full_name, phone),
      room:rooms(room_number, room_type:room_types(name, base_price))`
    )
    .eq('id', id)
    .single()

  const booking = data as unknown as BookingDetail | null
  if (!booking) redirect('/admin/bookings')

  const nights = nightsBetween(booking.check_in_date, booking.check_out_date)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/bookings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">{booking.booking_code}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.payment_status} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info icon={<Users className="h-4 w-4" />} label="Họ tên" value={booking.customer?.full_name || 'Khách'} />
              <Info icon={<Phone className="h-4 w-4" />} label="Số điện thoại" value={booking.customer?.phone || '-'} />
              <Info icon={<Mail className="h-4 w-4" />} label="Customer ID" value={booking.customer?.id || '-'} />
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>Thông tin đặt phòng</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info label="Phòng" value={`Phòng ${booking.room?.room_number || '-'}`} />
              <Info label="Loại phòng" value={booking.room?.room_type?.name || '-'} />
              <Info icon={<CalendarDays className="h-4 w-4" />} label="Check-in" value={formatDate(booking.check_in_date)} />
              <Info icon={<CalendarDays className="h-4 w-4" />} label="Check-out" value={formatDate(booking.check_out_date)} />
              <Info icon={<Users className="h-4 w-4" />} label="Số khách" value={`${booking.total_guests} khách`} />
              <Info label="Số đêm" value={`${nights} đêm`} />
            </CardContent>
          </Card>

          {booking.special_requests && (
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Yêu cầu đặc biệt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{booking.special_requests}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="h-fit border-amber-200 shadow-xl">
          <CardHeader>
            <CardTitle>Thao tác lifecycle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-amber-50 p-4">
              <div className="flex justify-between text-sm">
                <span>{nights} đêm</span>
                <span className="font-semibold">
                  {formatCurrency(Number(booking.room?.room_type?.base_price || 0) * nights)}
                </span>
              </div>
              <div className="mt-3 flex justify-between border-t border-amber-200 pt-3 text-lg font-black">
                <span>Tổng cộng</span>
                <span className="text-amber-700">{formatCurrency(Number(booking.total_price))}</span>
              </div>
            </div>

            {booking.status === 'pending' && (
              <BookingActionButton
                action={confirmBooking.bind(null, booking.id)}
                label="Xác nhận booking"
                className="w-full bg-blue-600 hover:bg-blue-700"
              />
            )}
            {booking.status === 'confirmed' && (
              <BookingActionButton
                action={checkInBooking.bind(null, booking.id)}
                label="Check-in"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              />
            )}
            {booking.status === 'checked_in' && (
              <BookingActionButton
                action={checkOutBooking.bind(null, booking.id)}
                label="Check-out"
                className="w-full bg-gray-900 hover:bg-gray-800"
              />
            )}
            {booking.status !== 'cancelled' && booking.status !== 'checked_out' && (
              <BookingActionButton
                action={cancelBookingAdmin.bind(null, booking.id)}
                label="Hủy booking"
                variant="destructive"
                className="w-full"
              />
            )}
            <Link href={`/booking/${booking.id}/print`} target="_blank">
              <Button variant="outline" className="w-full border-amber-300 font-semibold">
                In phiếu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-100 p-3">
      {icon && <div className="text-amber-700">{icon}</div>}
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="truncate font-semibold">{value}</p>
      </div>
    </div>
  )
}
