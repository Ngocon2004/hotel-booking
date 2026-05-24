import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarCheck, SearchX } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/bookings/status-badge'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { BookingStatus, PaymentStatus } from '@/types/database'

type SearchParams = Promise<{ status?: BookingStatus }>

type BookingRow = {
  id: string
  booking_code: string
  check_in_date: string
  check_out_date: string
  total_price: number
  status: BookingStatus
  payment_status: PaymentStatus
  room: {
    room_number: string
    room_type: { name: string } | null
  } | null
}

const statusFilters: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'checked_in', label: 'Đã check-in' },
  { value: 'checked_out', label: 'Đã check-out' },
  { value: 'cancelled', label: 'Đã hủy' },
]

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/my-bookings')

  let query = supabase
    .from('bookings')
    .select(
      `id, booking_code, check_in_date, check_out_date, total_price, status, payment_status,
      room:rooms(room_number, room_type:room_types(name))`
    )
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (params.status && params.status !== 'cancelled') {
    query = query.eq('status', params.status)
  } else if (params.status === 'cancelled') {
    query = query.eq('status', 'cancelled')
  }

  const { data } = await query
  const bookings = (data || []) as unknown as BookingRow[]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
          <CalendarCheck className="h-3 w-3" />
          Booking của tôi
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Lịch sử đặt phòng</h1>
        <p className="mt-2 text-gray-500">Theo dõi trạng thái và chi tiết các booking của bạn.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {statusFilters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === 'all' ? '/my-bookings' : `/my-bookings?status=${filter.value}`}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              (filter.value === 'all' && !params.status) || params.status === filter.value
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="border-amber-100">
              <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black">{booking.booking_code}</h2>
                    <BookingStatusBadge status={booking.status} />
                    <PaymentStatusBadge status={booking.payment_status} />
                  </div>
                  <p className="font-semibold">
                    Phòng {booking.room?.room_number || '-'} - {booking.room?.room_type?.name || '-'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
                  </p>
                </div>
                <div className="flex items-center gap-3 md:justify-end">
                  <p className="font-black text-amber-700">{formatCurrency(Number(booking.total_price))}</p>
                  <Link href={`/my-bookings/${booking.id}`}>
                    <Button variant="outline" className="border-amber-300 font-semibold">
                      Chi tiết
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-12 text-center">
          <SearchX className="mx-auto mb-3 h-12 w-12 text-amber-300" />
          <p className="font-semibold">Chưa có booking phù hợp</p>
          <Link href="/search" className="mt-4 inline-block">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-700 font-semibold">
              Tìm phòng ngay
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
