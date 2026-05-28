import Link from 'next/link'
import { BedDouble, CalendarCheck, DollarSign, Star, TrendingUp, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardCharts from '@/components/admin/dashboard-charts'
import { formatCurrency } from '@/lib/utils/format'

type RecentBooking = {
  id: string
  booking_code: string
  total_price: number
  status: string
  customer: {
    full_name: string | null
  } | null
  room: {
    room_number: string
    room_type: {
      name: string
    } | null
  } | null
}

type ChartBooking = {
  check_in_date: string
  total_price: number
  status: string
  room: {
    id: string
    room_type: {
      name: string
    } | null
  } | null
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: roomCount },
    { count: bookingCount },
    { count: customerCount },
    { count: pendingCount },
    { data: recentBookings },
    { data: revenueData },
    { data: chartBookings },
  ] = await Promise.all([
    supabase.from('rooms').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('bookings')
      .select(
        `*,
        customer:profiles(full_name),
        room:rooms(room_number, room_type:room_types(name))
      `
      )
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('bookings')
      .select('total_price, status')
      .in('status', ['confirmed', 'checked_in', 'checked_out']),
    supabase
      .from('bookings')
      .select('check_in_date, total_price, status, room:rooms(id, room_type:room_types(name))'),
  ])

  const totalRevenue = revenueData?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0
  const typedRecentBookings = (recentBookings || []) as unknown as RecentBooking[]
  const typedChartBookings = (chartBookings || []) as unknown as ChartBooking[]
  const revenueByMonth = new Map<string, number>()
  const statusCounts = new Map<string, number>()
  const roomTypeCounts = new Map<string, number>()

  typedChartBookings.forEach((booking) => {
    const month = booking.check_in_date.slice(0, 7)
    if (['confirmed', 'checked_in', 'checked_out'].includes(booking.status)) {
      revenueByMonth.set(month, (revenueByMonth.get(month) || 0) + Number(booking.total_price))
    }
    statusCounts.set(booking.status, (statusCounts.get(booking.status) || 0) + 1)
    const roomTypeName = booking.room?.room_type?.name || 'Khác'
    roomTypeCounts.set(roomTypeName, (roomTypeCounts.get(roomTypeName) || 0) + 1)
  })

  const revenueChart = Array.from(revenueByMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue }))
  const statusChart = Array.from(statusCounts.entries()).map(([status, count]) => ({
    status,
    count,
  }))
  const roomTypeChart = Array.from(roomTypeCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  const activeRoomIds = new Set(
    typedChartBookings
      .filter((booking) => ['confirmed', 'checked_in'].includes(booking.status))
      .map((booking) => booking.room?.id)
      .filter(Boolean)
  )
  const occupancyRate = roomCount ? (activeRoomIds.size / roomCount) * 100 : 0

  const stats = [
    {
      label: 'Tổng phòng',
      value: roomCount || 0,
      icon: BedDouble,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Tổng đặt phòng',
      value: bookingCount || 0,
      icon: CalendarCheck,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Khách hàng',
      value: customerCount || 0,
      icon: Users,
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Đang chờ duyệt',
      value: pendingCount || 0,
      icon: Star,
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-8 text-white shadow-xl">
        <h1 className="mb-2 text-3xl font-black sm:text-4xl">Chào mừng trở lại, Admin!</h1>
        <p className="text-amber-50">Đây là tổng quan hệ thống khách sạn hôm nay.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {s.label}
                  </p>
                  <p className="text-3xl font-black tracking-tight">{s.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}>
                  <s.icon className={`h-6 w-6 ${s.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardCharts
        revenue={revenueChart}
        statuses={statusChart}
        roomTypes={roomTypeChart}
        occupancyRate={occupancyRate}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-none bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-sm">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                Doanh thu đã xác nhận
              </span>
            </div>
            <p className="mb-2 text-4xl font-black">{formatCurrency(totalRevenue)}</p>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <TrendingUp className="h-3 w-3" />
              Tổng từ các booking đã xác nhận, check-in hoặc check-out
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Đặt phòng gần đây</CardTitle>
            <Link href="/admin/bookings" className="text-xs font-semibold text-amber-700 hover:underline">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent>
            {typedRecentBookings.length > 0 ? (
              <div className="space-y-3">
                {typedRecentBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between border-b border-amber-50 py-2 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {b.customer?.full_name || 'Khách'} - Phòng {b.room?.room_number}
                      </p>
                      <p className="text-xs text-gray-500">
                        {b.room?.room_type?.name} - {b.booking_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(b.total_price)}</p>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'confirmed'
                            ? 'text-emerald-600'
                            : b.status === 'pending'
                              ? 'text-amber-600'
                              : b.status === 'cancelled'
                                ? 'text-rose-600'
                                : 'text-gray-600'
                        }`}
                      >
                        {b.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">Chưa có đặt phòng nào.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Link href="/admin/rooms/new">
            <button className="w-full rounded-xl border-2 border-dashed border-amber-200 p-4 text-left transition-all hover:border-amber-500 hover:bg-amber-50">
              <BedDouble className="mb-2 h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold">Thêm phòng mới</p>
              <p className="text-xs text-gray-500">Tạo phòng và upload ảnh</p>
            </button>
          </Link>
          <Link href="/admin/room-types/new">
            <button className="w-full rounded-xl border-2 border-dashed border-amber-200 p-4 text-left transition-all hover:border-amber-500 hover:bg-amber-50">
              <BedDouble className="mb-2 h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold">Thêm loại phòng</p>
              <p className="text-xs text-gray-500">Standard, Deluxe, Suite...</p>
            </button>
          </Link>
          <Link href="/admin/bookings">
            <button className="w-full rounded-xl border-2 border-dashed border-amber-200 p-4 text-left transition-all hover:border-amber-500 hover:bg-amber-50">
              <CalendarCheck className="mb-2 h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold">Duyệt booking</p>
              <p className="text-xs text-gray-500">{pendingCount || 0} đang chờ</p>
            </button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
