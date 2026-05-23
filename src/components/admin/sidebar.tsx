'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BedDouble,
  Tag,
  CalendarCheck,
  Users,
  Star,
  ConciergeBell,
  Hotel,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
  { href: '/admin/room-types', label: 'Loại phòng', icon: Tag },
  { href: '/admin/rooms', label: 'Phòng', icon: BedDouble },
  { href: '/admin/bookings', label: 'Đặt phòng', icon: CalendarCheck },
  { href: '/admin/customers', label: 'Khách hàng', icon: Users },
  { href: '/admin/reviews', label: 'Đánh giá', icon: Star },
  { href: '/admin/services', label: 'Dịch vụ', icon: ConciergeBell },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 border-r border-amber-100 bg-white min-h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-amber-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md">
          <Hotel className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-black text-sm">HBMS</div>
          <div className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold">
            Admin
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Back to site */}
      <div className="p-3 mt-4 border-t border-amber-100">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-amber-700 transition-colors"
        >
          ← Về trang chủ
        </Link>
      </div>
    </aside>
  )
}
