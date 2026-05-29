import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware Supabase: refresh session token và bảo vệ các route được chỉ định.
 * Phải được gọi từ proxy.ts (root) để chạy trên mỗi request.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // QUAN TRỌNG: Không thêm logic giữa createServerClient và supabase.auth.getUser().
  // Điều này có thể gây lỗi đăng xuất ngẫu nhiên.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAdminOnlyPath =
    pathname === '/api-docs' ||
    pathname.startsWith('/api-docs/') ||
    pathname === '/api/openapi'

  // Các route công khai - cho phép truy cập không cần đăng nhập
  const publicPaths = [
    '/',
    '/auth',
    '/rooms',
    '/search',
    '/about',
    '/contact',
  ]
  const isPublic =
    publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public')

  // Nếu chưa đăng nhập + truy cập route protected → redirect tới login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Nếu truy cập route chỉ dành cho admin nhưng không phải admin → redirect về home
  if (user && (pathname.startsWith('/admin') || isAdminOnlyPath)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
