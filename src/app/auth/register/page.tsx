'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { register } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Hotel } from 'lucide-react'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-amber-200/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg">
            <Hotel className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Đăng ký</CardTitle>
          <CardDescription>Tạo tài khoản để đặt phòng nhanh chóng</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Họ và tên</Label>
              <Input id="full_name" name="full_name" placeholder="Nguyễn Văn A" required />
              {state?.errors?.full_name && (
                <p className="text-sm text-red-600">{state.errors.full_name[0]}</p>
              )}
            </div>

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
                placeholder="Ít nhất 8 ký tự"
                required
                autoComplete="new-password"
              />
              {state?.errors?.password && (
                <ul className="text-sm text-red-600 space-y-0.5">
                  {state.errors.password.map((err) => (
                    <li key={err}>• {err}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Xác nhận mật khẩu</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Nhập lại mật khẩu"
                required
                autoComplete="new-password"
              />
              {state?.errors?.confirm_password && (
                <p className="text-sm text-red-600">{state.errors.confirm_password[0]}</p>
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
              {pending ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Đã có tài khoản?{' '}
              <Link href="/auth/login" className="text-amber-700 font-semibold hover:underline">
                Đăng nhập
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
