import { z } from 'zod'

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày không hợp lệ')

export const bookingSearchSchema = z
  .object({
    check_in: dateStringSchema,
    check_out: dateStringSchema,
    guests: z.coerce.number().int().min(1, 'Số khách tối thiểu là 1'),
  })
  .superRefine((value, ctx) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const checkIn = new Date(`${value.check_in}T00:00:00`)
    const checkOut = new Date(`${value.check_out}T00:00:00`)

    if (checkIn < today) {
      ctx.addIssue({
        code: 'custom',
        path: ['check_in'],
        message: 'Không thể chọn ngày trong quá khứ',
      })
    }

    if (checkOut <= checkIn) {
      ctx.addIssue({
        code: 'custom',
        path: ['check_out'],
        message: 'Check-out phải sau check-in',
      })
    }
  })

export const createBookingSchema = bookingSearchSchema.extend({
  room_id: z.string().uuid('Phòng không hợp lệ'),
  special_requests: z.string().max(1000, 'Yêu cầu đặc biệt tối đa 1000 ký tự').optional(),
  services: z.array(z.string().uuid()).default([]),
})

export type BookingSearchInput = z.infer<typeof bookingSearchSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>

export type BookingFormState =
  | {
      errors?: Record<string, string[] | undefined>
      message?: string
    }
  | undefined
