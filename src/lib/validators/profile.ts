import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự').max(100),
  phone: z.string().trim().max(30, 'Số điện thoại tối đa 30 ký tự').optional(),
  address: z.string().trim().max(300, 'Dia chi toi da 300 ky tu').optional(),
  avatar_url: z.string().url('URL avatar khong hop le').optional().or(z.literal('')),
})

export type ProfileFormState =
  | {
      errors?: Record<string, string[] | undefined>
      message?: string
      success?: boolean
    }
  | undefined
