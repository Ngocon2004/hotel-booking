import AdminSidebar from '@/components/admin/sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { logout } from '@/server/actions/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Double-check ngay tại layout (RLS đã có ở DB, proxy đã có ở route)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/admin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const initials =
    profile?.full_name
      ?.split(' ')
      .map((n: string) => n[0])
      .slice(-2)
      .join('')
      .toUpperCase() || 'A'

  return (
    <div className="admin-light flex min-h-screen bg-white text-slate-950 [color-scheme:light]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
          <div>
            <h1 className="text-sm font-semibold text-gray-500">
              Khu vực quản trị
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-950">{profile?.full_name || user.email}</div>
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-[10px] uppercase tracking-wider">
                  Admin
                </Badge>
              </div>
              <Avatar className="w-9 h-9 border-2 border-blue-100">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-blue-50 text-blue-700 font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <form action={logout}>
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
