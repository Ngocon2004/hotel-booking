import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, MapPin, Phone, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookingStatusBadge } from '@/components/bookings/status-badge'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { BookingStatus } from '@/types/database'

type Params = Promise<{ id: string }>

type CustomerDetail = {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  bookings: {
    id: string
    booking_code: string
    check_in_date: string
    check_out_date: string
    total_price: number
    status: BookingStatus
    room: { room_number: string } | null
  }[]
}

export default async function AdminCustomerDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select(
      `id, full_name, phone, address,
      bookings(id, booking_code, check_in_date, check_out_date, total_price, status, room:rooms(room_number))`
    )
    .eq('id', id)
    .eq('role', 'customer')
    .single()

  const customer = data as unknown as CustomerDetail | null
  if (!customer) redirect('/admin/customers')

  const totalSpent = customer.bookings.reduce(
    (sum, booking) => sum + Number(booking.total_price),
    0
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">{customer.full_name || 'Khách'}</h1>
          <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Info icon={<User className="h-4 w-4" />} label="Họ tên" value={customer.full_name || '-'} />
        <Info icon={<Phone className="h-4 w-4" />} label="Số điện thoại" value={customer.phone || '-'} />
        <Info icon={<MapPin className="h-4 w-4" />} label="Địa chỉ" value={customer.address || '-'} />
      </div>

      <Card className="border-amber-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lịch sử booking</CardTitle>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Tổng chi tiêu</p>
            <p className="font-black text-amber-700">{formatCurrency(totalSpent)}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customer.bookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="grid gap-3 rounded-lg border border-amber-100 p-4 transition-colors hover:bg-amber-50 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-bold">{booking.booking_code}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Phòng {booking.room?.room_number || '-'} • {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <BookingStatusBadge status={booking.status} />
                  <span className="font-black text-amber-700">{formatCurrency(Number(booking.total_price))}</span>
                </div>
              </Link>
            ))}
            {customer.bookings.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">Khách này chưa có booking.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="border-amber-100">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="text-amber-700">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
          <p className="truncate font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
