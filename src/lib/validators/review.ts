import { z } from 'zod'

export const reviewSchema = z.object({
  booking_id: z.string().uuid('Booking khong hop le'),
  rating: z.coerce
    .number()
    .int('Diem danh gia phai la so nguyen')
    .min(1, 'Vui long chon toi thieu 1 sao')
    .max(5, 'Diem danh gia toi da la 5 sao'),
  comment: z
    .string()
    .trim()
    .max(1000, 'Binh luan toi da 1000 ky tu')
    .optional(),
})

export type ReviewFormState =
  | {
      errors?: Record<string, string[] | undefined>
      message?: string
      success?: boolean
    }
  | undefined
