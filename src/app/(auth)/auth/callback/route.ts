import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error_description') || requestUrl.searchParams.get('error')
  const nextParam = requestUrl.searchParams.get('next') || '/'
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/'

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error)}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
      )
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
