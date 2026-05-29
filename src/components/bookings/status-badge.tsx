import { Badge } from '@/components/ui/badge'
import type { BookingStatus, PaymentStatus } from '@/types/database'

const bookingStatusMap: Record<BookingStatus, { label: string; className: string }> = {
  pending: {
    label: 'Chờ xác nhận',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  },
  confirmed: {
    label: 'Đã xác nhận',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  checked_in: {
    label: 'Đã check-in',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  },
  checked_out: {
    label: 'Đã check-out',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
  cancelled: {
    label: 'Đã huỷ',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

const paymentStatusMap: Record<PaymentStatus, { label: string; className: string }> = {
  unpaid: {
    label: 'Chưa thanh toán',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  },
  paid: {
    label: 'Đã thanh toán',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  },
  refunded: {
    label: 'Đã hoàn tiền',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const item = bookingStatusMap[status]
  return <Badge className={item.className}>{item.label}</Badge>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const item = paymentStatusMap[status]
  return <Badge className={item.className}>{item.label}</Badge>
}

export function getBookingStatusLabel(status: BookingStatus) {
  return bookingStatusMap[status].label
}
