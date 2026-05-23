import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Hotel, Menu, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { logout } from '@/app/actions/auth'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .slice(-2)
        .join('')
        .toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-amber-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">
            HBMS
            <span className="text-amber-700"> Hotel</span>
          </span>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-amber-700 transition-colors">
            Trang chủ
          </Link>
          <Link href="/rooms" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-amber-700 transition-colors">
            Phòng
          </Link>
          <Link href="/search" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-amber-700 transition-colors">
            Tìm kiếm
          </Link>
          {user && (
            <Link href="/my-bookings" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-amber-700 transition-colors">
              Đặt chỗ của tôi
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-amber-50 rounded-full p-1 transition-colors outline-none">
                <Avatar className="w-9 h-9 border-2 border-amber-200">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-amber-100 text-amber-700 font-bold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-semibold">{profile?.full_name || user.email}</span>
                    <span className="text-xs font-normal text-muted-foreground truncate">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/profile" />}>
                  <User className="w-4 h-4 mr-2" />
                  Hồ sơ cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/my-bookings" />}>
                  Lịch sử đặt phòng
                </DropdownMenuItem>
                {profile?.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="font-semibold text-amber-700"
                      render={<Link href="/admin" />}
                    >
                      🛡️ Trang quản trị
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <form action={logout}>
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    render={<button type="submit" />}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="font-semibold">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/auth/register" className="hidden sm:block">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 font-semibold">
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
