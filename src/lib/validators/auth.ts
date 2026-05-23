import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').trim(),
    email: z.string().email('Email không hợp lệ'),
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[a-zA-Z]/, 'Phải chứa ít nhất 1 chữ cái')
      .regex(/[0-9]/, 'Phải chứa ít nhất 1 chữ số'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirm_password'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export type AuthFormState = {
  errors?: {
    full_name?: string[]
    email?: string[]
    password?: string[]
    confirm_password?: string[]
    _form?: string[]
  }
  message?: string
} | undefined
