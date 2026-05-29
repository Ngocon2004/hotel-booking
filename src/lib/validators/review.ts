import { z } from 'zod'

export const reviewSchema = z.object({
  booking_id: z.string().uuid('Booking khong hop le'),
  rating: z.coerce
    .number()
    .int('Điểm đánh giá phải là số nguyên')
    .min(1, 'Vui lòng chọn tối thiểu 1 sao')
    .max(5, 'Điểm đánh giá tối đa là 5 sao'),
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
