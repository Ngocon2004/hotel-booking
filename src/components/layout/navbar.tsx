import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Hotel, User } from 'lucide-react'
import ThemeToggle from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { logout } from '@/server/actions/auth'
import SearchForm from '@/components/booking/search-form'

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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/88 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/88">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-900/20 group-hover:shadow-lg transition-shadow">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
            HBMS
            <span className="text-blue-600 dark:text-blue-300"> Hotel</span>
          </span>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:text-blue-300">
            Trang chủ
          </Link>
          <Link href="/rooms" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:text-blue-300">
            Phòng
          </Link>
          <Link href="/search" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:text-blue-300">
            Tìm kiếm
          </Link>
          {user && (
            <Link href="/my-bookings" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors dark:text-slate-200 dark:hover:text-blue-300">
              Đặt chỗ của tôi
            </Link>
          )}
        </div>

        <div className="hidden xl:block">
          <SearchForm compact />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-blue-50 rounded-full p-1 transition-colors outline-none dark:hover:bg-white/10">
                <Avatar className="w-9 h-9 border-2 border-blue-200">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">{profile?.full_name || user.email}</span>
                      <span className="text-xs font-normal text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
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
                      className="font-semibold text-blue-700 dark:text-blue-300"
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
                    nativeButton
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
                <Button className="bg-blue-600 font-semibold text-white hover:bg-blue-700">
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
