import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BedDouble,
  CalendarCheck,
  Users,
  DollarSign,
  TrendingUp,
  Star,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Parallel data fetching
  const [
    { count: roomCount },
    { count: bookingCount },
    { count: customerCount },
    { count: pendingCount },
    { data: recentBookings },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from('rooms').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer'),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
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
  ])

  const totalRevenue =
    revenueData?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0

  const stats = [
    {
      label: 'Tổng phòng',
      value: roomCount || 0,
      icon: BedDouble,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Tổng đặt phòng',
      value: bookingCount || 0,
      icon: CalendarCheck,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Khách hàng',
      value: customerCount || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Đang chờ duyệt',
      value: pendingCount || 0,
      icon: Star,
      color: 'from-rose-500 to-rose-600',
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-8 text-white shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-black mb-2">
          Chào mừng trở lại, Admin! 👋
        </h1>
        <p className="text-amber-50">Đây là tổng quan hệ thống của bạn hôm nay.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    {s.label}
                  </p>
                  <p className="text-3xl font-black tracking-tight">{s.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue card + Recent bookings */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                Doanh thu (xác nhận)
              </span>
            </div>
            <p className="text-4xl font-black mb-2">{formatCurrency(totalRevenue)}</p>
            <div className="flex items-center gap-1 text-xs opacity-90">
              <TrendingUp className="w-3 h-3" />
              Tổng từ tất cả booking đã confirm
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Đặt phòng gần đây</CardTitle>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-amber-700 hover:underline"
            >
              Xem tất cả →
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookings && recentBookings.length > 0 ? (
              <div className="space-y-3">
                {recentBookings.map((b: any) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between py-2 border-b border-amber-50 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {b.customer?.full_name || 'Khách'} - Phòng {b.room?.room_number}
                      </p>
                      <p className="text-xs text-gray-500">
                        {b.room?.room_type?.name} • {b.booking_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatCurrency(b.total_price)}</p>
                      <p
                        className={`text-[10px] uppercase tracking-wider font-bold ${
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
              <p className="text-center text-sm text-gray-400 py-8">
                Chưa có đặt phòng nào.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3">
          <Link href="/admin/rooms/new">
            <button className="w-full p-4 rounded-xl border-2 border-dashed border-amber-200 hover:border-amber-500 hover:bg-amber-50 transition-all text-left">
              <BedDouble className="w-5 h-5 text-amber-600 mb-2" />
              <p className="font-semibold text-sm">Thêm phòng mới</p>
              <p className="text-xs text-gray-500">Tạo phòng + upload ảnh</p>
            </button>
          </Link>
          <Link href="/admin/room-types/new">
            <button className="w-full p-4 rounded-xl border-2 border-dashed border-amber-200 hover:border-amber-500 hover:bg-amber-50 transition-all text-left">
              <BedDouble className="w-5 h-5 text-amber-600 mb-2" />
              <p className="font-semibold text-sm">Thêm loại phòng</p>
              <p className="text-xs text-gray-500">Standard, Deluxe, Suite...</p>
            </button>
          </Link>
          <Link href="/admin/bookings">
            <button className="w-full p-4 rounded-xl border-2 border-dashed border-amber-200 hover:border-amber-500 hover:bg-amber-50 transition-all text-left">
              <CalendarCheck className="w-5 h-5 text-amber-600 mb-2" />
              <p className="font-semibold text-sm">Duyệt booking</p>
              <p className="text-xs text-gray-500">{pendingCount || 0} đang chờ</p>
            </button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
