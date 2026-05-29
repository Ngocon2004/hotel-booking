import Link from 'next/link'
import { CalendarCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/bookings/status-badge'
import RealtimeBookingToast from '@/components/bookings/realtime-booking-toast'
import Pagination from '@/components/ui/pagination'
import DebouncedSearch from '@/components/ui/debounced-search'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { BookingStatus, PaymentStatus } from '@/types/database'

type SearchParams = Promise<{
  status?: BookingStatus
  q?: string
  page?: string
}>

type BookingRow = {
  id: string
  booking_code: string
  check_in_date: string
  check_out_date: string
  total_price: number
  status: BookingStatus
  payment_status: PaymentStatus
  customer: { full_name: string | null; phone: string | null } | null
  room: { room_number: string; room_type: { name: string } | null } | null
}

const statusFilters: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'checked_in', label: 'Đã check-in' },
  { value: 'checked_out', label: 'Đã check-out' },
  { value: 'cancelled', label: 'Đã huỷ' },
]

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const supabase = await createClient()
  const currentPage = Math.max(1, Number(params.page || 1))
  const pageSize = 10

  let query = supabase
    .from('bookings')
    .select(
      `id, booking_code, check_in_date, check_out_date, total_price, status, payment_status,
      customer:profiles(full_name, phone),
      room:rooms(room_number, room_type:room_types(name))`
    )
    .order('created_at', { ascending: false })

  if (params.status) query = query.eq('status', params.status)

  const { data } = await query
  let bookings = (data || []) as unknown as BookingRow[]

  if (params.q) {
    const q = params.q.toLowerCase()
    bookings = bookings.filter(
      (booking) =>
        booking.booking_code.toLowerCase().includes(q) ||
        booking.customer?.full_name?.toLowerCase().includes(q) ||
        booking.room?.room_number.toLowerCase().includes(q)
    )
  }

  const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize))
  const page = Math.min(currentPage, totalPages)
  const pagedBookings = bookings.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-6">
      <RealtimeBookingToast />
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
          <CalendarCheck className="h-3 w-3" />
          Booking lifecycle
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Quản lý đặt phòng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Xác nhận, check-in, check-out hoặc hủy booking.
        </p>
      </div>

      <Card className="border-amber-100">
        <CardContent className="space-y-4 p-5">
          <DebouncedSearch
            basePath="/admin/bookings"
            defaultValue={params.q || ''}
            placeholder="Tìm mã booking, khách, phòng..."
            searchParams={{ status: params.status }}
          />

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <Link
                key={filter.value}
                href={
                  filter.value === 'all'
                    ? '/admin/bookings'
                    : `/admin/bookings?status=${filter.value}`
                }
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
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border border-amber-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-amber-50 text-left text-xs uppercase tracking-wider text-amber-900">
            <tr>
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">Khách</th>
              <th className="px-4 py-3">Phòng</th>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {pagedBookings.map((booking) => (
              <tr key={booking.id} className="border-t border-amber-50">
                <td className="px-4 py-3 font-bold">{booking.booking_code}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{booking.customer?.full_name || 'Khách'}</p>
                  <p className="text-xs text-gray-500">{booking.customer?.phone || '-'}</p>
                </td>
                <td className="px-4 py-3">
                  Phòng {booking.room?.room_number || '-'}
                  <p className="text-xs text-gray-500">{booking.room?.room_type?.name || '-'}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <BookingStatusBadge status={booking.status} />
                    <PaymentStatusBadge status={booking.payment_status} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-black text-amber-700">
                  {formatCurrency(Number(booking.total_price))}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <Button variant="outline" size="sm">
                      Chi tiết
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {pagedBookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  Không có booking phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/bookings"
        searchParams={{ status: params.status, q: params.q }}
      />
    </div>
  )
}
