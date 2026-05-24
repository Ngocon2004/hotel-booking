'use server'

import { createClient } from '@/lib/supabase/server'
import {
  emailLoginSchema,
  loginSchema,
  registerSchema,
  type AuthFormState,
} from '@/lib/validators/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

function safeRedirectPath(value: FormDataEntryValue | string | null): string {
  const path = String(value || '/')
  if (!path.startsWith('/') || path.startsWith('//')) return '/'
  return path
}

/**
 * Đăng nhập bằng email + mật khẩu.
 */
export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validated = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  })

  if (error) {
    return {
      errors: { _form: ['Email hoặc mật khẩu không đúng. Vui lòng thử lại.'] },
    }
  }

  const redirectTo = safeRedirectPath(formData.get('redirect'))
  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

/**
 * Gửi magic link đăng nhập qua email.
 */
export async function loginWithEmail(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validated = emailLoginSchema.safeParse({
    email: formData.get('magic_email'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const redirectTo = safeRedirectPath(formData.get('redirect'))
  const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_SITE_URL || ''
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email: validated.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  })

  if (error) {
    return { errors: { _form: [error.message || 'Không thể gửi email đăng nhập'] } }
  }

  return {
    message: 'Đã gửi link đăng nhập. Vui lòng kiểm tra email của bạn.',
  }
}

/**
 * Đăng nhập bằng Google OAuth.
 */
export async function loginWithGoogle(formData: FormData) {
  const redirectTo = safeRedirectPath(formData.get('redirect'))
  const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_SITE_URL || ''
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  })

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }

  redirect('/auth/login')
}

/**
 * Đăng ký tài khoản mới.
 * Trigger trong DB sẽ tự động tạo profiles row.
 */
export async function register(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validated = registerSchema.safeParse({
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: { full_name: validated.data.full_name },
    },
  })

  if (error) {
    return {
      errors: { _form: [error.message || 'Đăng ký thất bại. Vui lòng thử lại.'] },
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

/**
 * Đăng xuất.
 */
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
