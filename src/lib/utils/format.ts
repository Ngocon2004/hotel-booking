/**
 * Format helpers: ngày tháng, tiền tệ, slug.
 */

import dayjs from 'dayjs'
import 'dayjs/locale/vi'

dayjs.locale('vi')

/**
 * Format số thành VND: 1500000 → "1.500.000 ₫"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format ngày: "2025-12-15" → "15/12/2025"
 */
export function formatDate(date: string | Date, format = 'DD/MM/YYYY'): string {
  return dayjs(date).format(format)
}

/**
 * Format datetime: "2025-12-15T10:30:00" → "15/12/2025 10:30"
 */
export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

/**
 * Số đêm giữa 2 ngày
 */
export function nightsBetween(checkIn: string | Date, checkOut: string | Date): number {
  return dayjs(checkOut).diff(dayjs(checkIn), 'day')
}

/**
 * Slugify text: "Phòng Deluxe Hướng Biển" → "phong-deluxe-huong-bien"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

/**
 * Sinh booking code phía client (fallback nếu DB không tự sinh)
 */
export function generateBookingCode(): string {
  const date = dayjs().format('YYYYMMDD')
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `HTL-${date}-${rand}`
}

/**
 * Tính tổng tiền: số đêm × giá/đêm
 */
export function calculateTotalPrice(
  checkIn: string,
  checkOut: string,
  pricePerNight: number
): number {
  const nights = nightsBetween(checkIn, checkOut)
  return nights * pricePerNight
}
