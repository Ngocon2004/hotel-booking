import { z } from 'zod'

export const roomTypeSchema = z.object({
  name: z.string().min(2, 'Tên loại phòng phải có ít nhất 2 ký tự').trim(),
  slug: z.string().min(2, 'Slug phải có ít nhất 2 ký tự').trim().optional(),
  description: z.string().optional(),
  base_price: z.coerce.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  max_occupancy: z.coerce.number().int().min(1, 'Sức chứa tối thiểu là 1'),
  amenities: z.array(z.string()).default([]),
})

export const roomSchema = z.object({
  room_number: z.string().min(1, 'Số phòng không được để trống').trim(),
  room_type_id: z.string().uuid('Vui lòng chọn loại phòng'),
  floor: z.coerce.number().int().optional(),
  description: z.string().optional(),
  status: z.enum(['available', 'maintenance']).default('available'),
  images: z.array(z.string().url()).default([]),
})

export type RoomTypeInput = z.infer<typeof roomTypeSchema>
export type RoomInput = z.infer<typeof roomSchema>

export type FormState =
  | {
      errors?: Record<string, string[] | undefined>
      message?: string
      success?: boolean
    }
  | undefined

// Danh sách amenities chuẩn (key + label tiếng Việt + icon name từ lucide)
export const AMENITIES_OPTIONS = [
  { key: 'wifi', label: 'Wi-Fi miễn phí', icon: 'wifi' },
  { key: 'tv', label: 'TV màn hình phẳng', icon: 'tv' },
  { key: 'air_conditioner', label: 'Máy lạnh', icon: 'air-vent' },
  { key: 'mini_fridge', label: 'Tủ lạnh mini', icon: 'refrigerator' },
  { key: 'mini_bar', label: 'Mini bar', icon: 'wine' },
  { key: 'bathtub', label: 'Bồn tắm', icon: 'bath' },
  { key: 'jacuzzi', label: 'Bồn jacuzzi', icon: 'sparkles' },
  { key: 'balcony', label: 'Ban công', icon: 'mountain' },
  { key: 'living_room', label: 'Phòng khách riêng', icon: 'sofa' },
  { key: 'safe', label: 'Két sắt', icon: 'lock' },
  { key: 'butler', label: 'Butler 24/7', icon: 'concierge-bell' },
  { key: 'private_pool', label: 'Hồ bơi riêng', icon: 'waves' },
] as const

export function getAmenityLabel(key: string): string {
  return AMENITIES_OPTIONS.find((a) => a.key === key)?.label || key
}
