import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js 16 Proxy (trước đây là Middleware).
 * Refresh Supabase session và bảo vệ các route nhạy cảm.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match tất cả paths trừ:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icon files
     * - các file public (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
