import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'Ho ten toi thieu 2 ky tu').max(100),
  phone: z.string().trim().max(30, 'So dien thoai toi da 30 ky tu').optional(),
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
