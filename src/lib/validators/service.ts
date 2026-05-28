import { z } from 'zod'

export const serviceSchema = z.object({
  name: z.string().trim().min(2, 'Ten dich vu toi thieu 2 ky tu'),
  description: z.string().trim().max(500, 'Mo ta toi da 500 ky tu').optional(),
  price: z.coerce.number().min(0, 'Gia khong duoc am'),
  icon: z.string().trim().max(50, 'Icon toi da 50 ky tu').optional(),
  is_active: z.boolean().default(true),
})

export type ServiceFormState =
  | {
      errors?: Record<string, string[] | undefined>
      message?: string
    }
  | undefined
