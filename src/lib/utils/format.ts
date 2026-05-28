/**
 * Format helpers: ngày tháng, tiền tệ, slug.
 */

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/vi'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('vi')

export const HOTEL_TIME_ZONE = 'Asia/Ho_Chi_Minh'

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/

export function hotelNow() {
  return dayjs().tz(HOTEL_TIME_ZONE)
}

export function hotelToday() {
  return hotelNow().startOf('day')
}

export function parseHotelDate(date: string | Date) {
  if (typeof date === 'string' && DATE_ONLY_RE.test(date)) {
    return dayjs.tz(`${date}T00:00:00`, HOTEL_TIME_ZONE)
  }

  return dayjs(date).tz(HOTEL_TIME_ZONE)
}

export function hoursUntilHotelDate(date: string): number {
  return parseHotelDate(date).diff(hotelNow(), 'hour', true)
}

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
  return parseHotelDate(date).format(format)
}

/**
 * Format datetime: "2025-12-15T10:30:00" → "15/12/2025 10:30"
 */
export function formatDateTime(date: string | Date): string {
  return parseHotelDate(date).format('DD/MM/YYYY HH:mm')
}

/**
 * Số đêm giữa 2 ngày
 */
export function nightsBetween(checkIn: string | Date, checkOut: string | Date): number {
  return parseHotelDate(checkOut).diff(parseHotelDate(checkIn), 'day')
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
  const date = hotelNow().format('YYYYMMDD')
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
