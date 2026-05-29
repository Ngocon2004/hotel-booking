import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function isUsableHost(hostname: string) {
  return hostname !== '0.0.0.0' && hostname !== '::'
}

function getRedirectOrigin(request: Request) {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (configuredSiteUrl) {
    try {
      const url = new URL(configuredSiteUrl)
      if (isUsableHost(url.hostname)) return url.origin
    } catch {
      // Fall through to proxy headers/request URL.
    }
  }

  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  if (forwardedHost) {
    const host = forwardedHost.split(',')[0]?.trim()
    if (host) {
      const hostname = host.split(':')[0] || host
      if (isUsableHost(hostname)) return `${forwardedProto}://${host}`
    }
  }

  const requestUrl = new URL(request.url)
  if (isUsableHost(requestUrl.hostname)) return requestUrl.origin
  return 'http://localhost:3000'
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const redirectOrigin = getRedirectOrigin(request)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error_description') || requestUrl.searchParams.get('error')
  const nextParam = requestUrl.searchParams.get('next') || '/'
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/'

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error)}`, redirectOrigin)
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, redirectOrigin)
      )
    }
  }

  return NextResponse.redirect(new URL(next, redirectOrigin))
}
