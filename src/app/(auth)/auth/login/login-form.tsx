'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { login, loginWithEmail, loginWithGoogle } from '@/server/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Hotel } from 'lucide-react'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const oauthError = searchParams.get('error')
  const [state, action, pending] = useActionState(login, undefined)
  const [emailState, emailAction, emailPending] = useActionState(loginWithEmail, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-amber-200/50">
        <CardHeader className="space-y-3 text-center">
          <Link href="/" className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
            <Hotel className="w-8 h-8 text-white" />
          </Link>
          <CardTitle className="text-3xl font-bold tracking-tight">Đăng nhập</CardTitle>
          <CardDescription>Chào mừng trở lại HBMS Hotel</CardDescription>
        </CardHeader>
        <CardContent>
          {oauthError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {oauthError}
            </div>
          )}

          <form action={action} className="space-y-4">
            <input type="hidden" name="redirect" value={redirectTo} />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
              {state?.errors?.email && (
                <p className="text-sm text-red-600">{state.errors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              {state?.errors?.password && (
                <p className="text-sm text-red-600">{state.errors.password[0]}</p>
              )}
            </div>

            {state?.errors?._form && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {state.errors._form[0]}
              </div>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold h-11"
            >
              {pending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <Link href="/auth/register" className="text-amber-700 font-semibold hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-amber-100" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Hoặc
            </span>
            <div className="h-px flex-1 bg-amber-100" />
          </div>

          <form action={emailAction} className="space-y-4">
            <input type="hidden" name="redirect" value={redirectTo} />

            <div className="space-y-2">
              <Label htmlFor="magic_email">Đăng nhập bằng email</Label>
              <Input
                id="magic_email"
                name="magic_email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
              {emailState?.errors?.email && (
                <p className="text-sm text-red-600">{emailState.errors.email[0]}</p>
              )}
            </div>

            {emailState?.errors?._form && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {emailState.errors._form[0]}
              </div>
            )}

            {emailState?.message && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                {emailState.message}
              </div>
            )}

            <Button
              type="submit"
              variant="outline"
              disabled={emailPending}
              className="w-full border-amber-300 font-semibold h-11"
            >
              {emailPending ? 'Đang gửi email...' : 'Gửi link đăng nhập'}
            </Button>
          </form>

          <form action={loginWithGoogle} className="mt-3">
            <input type="hidden" name="redirect" value={redirectTo} />
            <Button
              type="submit"
              variant="outline"
              className="w-full border-gray-200 bg-white font-semibold h-11"
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 text-xs font-black text-blue-600">
                G
              </span>
              Đăng nhập với Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
