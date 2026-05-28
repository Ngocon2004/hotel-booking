'use client'

import type { ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type RevenuePoint = {
  month: string
  revenue: number
}

type StatusPoint = {
  status: string
  count: number
}

type RoomTypePoint = {
  name: string
  count: number
}

type Props = {
  revenue: RevenuePoint[]
  statuses: StatusPoint[]
  roomTypes: RoomTypePoint[]
  occupancyRate: number
}

const COLORS = ['#d97706', '#059669', '#2563eb', '#dc2626', '#7c3aed']

function ChartFrame({
  children,
  empty,
}: {
  children: ReactNode
  empty: boolean
}) {
  if (empty) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-amber-200 text-sm text-gray-400">
        Chưa có dữ liệu để hiển thị.
      </div>
    )
  }

  return <div className="h-72 min-w-0">{children}</div>
}

export default function DashboardCharts({ revenue, statuses, roomTypes, occupancyRate }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-amber-100 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Tỷ lệ lấp phòng hiện tại</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-4xl font-black text-amber-700">{occupancyRate.toFixed(1)}%</p>
              <p className="mt-1 text-sm text-gray-500">
                Tỷ lệ phòng đang có booking đã xác nhận hoặc đã check-in.
              </p>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-amber-100 sm:flex-1">
              <div
                className="h-full rounded-full bg-amber-600 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, occupancyRate))}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="text-lg">Doanh thu theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartFrame empty={revenue.length === 0}>
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => Number(value).toLocaleString('vi-VN')} />
                <Line type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartFrame>
        </CardContent>
      </Card>

      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="text-lg">Booking theo trạng thái</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartFrame empty={statuses.length === 0}>
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie data={statuses} dataKey="count" nameKey="status" outerRadius={92} label>
                  {statuses.map((entry, index) => (
                    <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartFrame>
        </CardContent>
      </Card>

      <Card className="border-amber-100 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Top loại phòng được đặt</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartFrame empty={roomTypes.length === 0}>
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={roomTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </CardContent>
      </Card>
    </div>
  )
}
