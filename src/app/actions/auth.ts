'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema, type AuthFormState } from '@/lib/validators/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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

  const redirectTo = (formData.get('redirect') as string) || '/'
  revalidatePath('/', 'layout')
  redirect(redirectTo)
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
