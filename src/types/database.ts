/**
 * TypeScript types cho database schema.
 * Trong dự án thực, có thể generate tự động từ Supabase CLI:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */

export type UserRole = 'admin' | 'customer'
export type RoomStatus = 'available' | 'maintenance'
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'
export type PaymentMethod = 'cash' | 'bank_transfer' | 'momo' | 'vnpay'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  address: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface RoomType {
  id: string
  name: string
  slug: string
  description: string | null
  base_price: number
  max_occupancy: number
  amenities: string[]
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  room_number: string
  room_type_id: string
  floor: number | null
  description: string | null
  status: RoomStatus
  images: string[]
  created_at: string
  updated_at: string
  room_type?: RoomType
}

export interface Booking {
  id: string
  booking_code: string
  customer_id: string
  room_id: string
  check_in_date: string
  check_out_date: string
  total_guests: number
  total_price: number
  status: BookingStatus
  payment_status: PaymentStatus
  special_requests: string | null
  created_at: string
  updated_at: string
  customer?: Profile
  room?: Room
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  method: PaymentMethod
  transaction_id: string | null
  paid_at: string
}

export interface Review {
  id: string
  booking_id: string
  customer_id: string
  rating: number
  comment: string | null
  created_at: string
  customer?: Profile
}

export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  icon: string | null
  is_active: boolean
  created_at: string
}

export interface BookingService {
  booking_id: string
  service_id: string
  quantity: number
  price_at_booking: number
  service?: Service
}
