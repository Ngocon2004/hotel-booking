import { z } from 'zod'

export const serviceSchema = z.object({
  name: z.string().trim().min(2, 'Tên dịch vụ tối thiểu 2 ký tự'),
  description: z.string().trim().max(500, 'Mô tả tối đa 500 ký tự').optional(),
  price: z.coerce.number().min(0, 'Giá không được âm'),
  icon: z.string().trim().max(50, 'Icon tối đa 50 ký tự').optional(),
  is_active: z.boolean().default(true),
})

export type ServiceFormState =
  | {
      errors?: Record<string, string[] | undefined>
      message?: string
    }
  | undefined
