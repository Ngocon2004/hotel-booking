import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarCheck, Copy, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils/format'

type Params = Promise<{ code: string }>

type BookingDetail = {
  booking_code: string
  check_in_date: string
  check_out_date: string
  total_guests: number
  total_price: number
  status: string
  payment_status: string
  special_requests: string | null
  room: {
    room_number: string
    room_type: {
      name: string
    } | null
  } | null
}

export default async function BookingSuccessPage({ params }: { params: Params }) {
  const { code } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data } = await supabase
    .from('bookings')
    .select(
      `booking_code, check_in_date, check_out_date, total_guests, total_price, status, payment_status, special_requests,
      room:rooms(room_number, room_type:room_types(name))`
    )
    .eq('booking_code', code)
    .single()

  const booking = data as unknown as BookingDetail | null

  if (!booking) {
    redirect('/rooms')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CalendarCheck className="h-9 w-9" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">Đặt phòng thành công</h1>
        <p className="mt-2 text-gray-500">
          Booking của bạn đã được tạo và đang chờ khách sạn xác nhận.
        </p>
      </div>

      <Card className="border-amber-100 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-3">
            <span>Mã đặt phòng</span>
            <span className="rounded-lg bg-amber-100 px-3 py-1 font-mono text-amber-800">
              {booking.booking_code}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="Phòng" value={`Phòng ${booking.room?.room_number || '-'} - ${booking.room?.room_type?.name || '-'}`} />
            <Info label="Số khách" value={`${booking.total_guests} khách`} />
            <Info label="Check-in" value={formatDate(booking.check_in_date)} />
            <Info label="Check-out" value={formatDate(booking.check_out_date)} />
            <Info label="Trạng thái" value={booking.status} />
            <Info label="Thanh toán" value={booking.payment_status} />
          </div>

          {booking.special_requests && (
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-900">Yêu cầu đặc biệt</p>
              <p className="mt-1 text-sm text-gray-600">{booking.special_requests}</p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-amber-100 pt-4 text-lg font-black">
            <span>Tổng cộng</span>
            <span className="text-amber-700">{formatCurrency(Number(booking.total_price))}</span>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link href="/rooms" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Xem thêm phòng
              </Button>
            </Link>
            <Link href="/my-bookings" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-700 font-semibold">
                <Copy className="mr-2 h-4 w-4" />
                Xem booking của tôi
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-amber-100 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  )
}
