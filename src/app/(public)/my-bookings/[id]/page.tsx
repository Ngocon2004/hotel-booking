import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, BedDouble, CalendarDays, Star, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import BookingActionButton from '@/components/bookings/booking-action-button'
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/bookings/status-badge'
import { cancelBooking } from '@/server/actions/bookings'
import ReviewForm from '@/components/reviews/review-form'
import { formatCurrency, formatDate, hoursUntilHotelDate, nightsBetween } from '@/lib/utils/format'
import type { BookingStatus, PaymentStatus } from '@/types/database'

type Params = Promise<{ id: string }>

type BookingDetail = {
  id: string
  booking_code: string
  check_in_date: string
  check_out_date: string
  total_guests: number
  total_price: number
  status: BookingStatus
  payment_status: PaymentStatus
  special_requests: string | null
  room: {
    room_number: string
    images: string[]
    room_type: {
      name: string
      base_price: number
    } | null
  } | null
}

type BookingReview = {
  id: string
  rating: number
  comment: string | null
  created_at: string
}

export default async function MyBookingDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/auth/login?redirect=/my-bookings/${id}`)

  const { data } = await supabase
    .from('bookings')
    .select(
      `id, booking_code, check_in_date, check_out_date, total_guests, total_price, status, payment_status, special_requests,
      room:rooms(room_number, images, room_type:room_types(name, base_price))`
    )
    .eq('id', id)
    .eq('customer_id', user.id)
    .single()

  const booking = data as unknown as BookingDetail | null
  if (!booking) redirect('/my-bookings')

  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at')
    .eq('booking_id', booking.id)
    .eq('customer_id', user.id)
    .maybeSingle()

  const review = existingReview as BookingReview | null

  const cover = booking.room?.images?.[0]
  const nights = nightsBetween(booking.check_in_date, booking.check_out_date)
  const canCancel =
    booking.status === 'pending' ||
    hoursUntilHotelDate(booking.check_in_date) > 24

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/my-bookings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">{booking.booking_code}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.payment_status} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="overflow-hidden border-amber-100">
            <div className="aspect-[16/9] bg-amber-50">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt={`Phòng ${booking.room?.room_number}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-amber-300">
                  <BedDouble className="h-16 w-16" />
                </div>
              )}
            </div>
            <CardContent className="p-5">
              <p className="text-sm font-bold uppercase tracking-wider text-amber-700">
                {booking.room?.room_type?.name || '-'}
              </p>
              <h2 className="mt-1 text-2xl font-black">Phòng {booking.room?.room_number || '-'}</h2>
            </CardContent>
          </Card>

          {booking.special_requests && (
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Yêu cầu đặc biệt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{booking.special_requests}</p>
              </CardContent>
            </Card>
          )}

          {booking.status === 'checked_out' && (
            <Card className="border-amber-100">
              <CardHeader>
                <CardTitle>Đánh giá lưu trú</CardTitle>
              </CardHeader>
              <CardContent>
                {review ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm leading-relaxed text-gray-600">{review.comment}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      Đã đánh giá ngày {formatDate(review.created_at)}
                    </p>
                  </div>
                ) : (
                  <ReviewForm bookingId={booking.id} />
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="h-fit border-amber-200 shadow-xl">
          <CardHeader>
            <CardTitle>Chi tiết lưu trú</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Info icon={<CalendarDays className="h-4 w-4" />} label="Check-in" value={formatDate(booking.check_in_date)} />
            <Info icon={<CalendarDays className="h-4 w-4" />} label="Check-out" value={formatDate(booking.check_out_date)} />
            <Info icon={<Users className="h-4 w-4" />} label="Số khách" value={`${booking.total_guests} khách`} />
            <div className="rounded-lg bg-amber-50 p-4 text-sm">
              <div className="flex justify-between">
                <span>{nights} đêm</span>
                <span className="font-semibold">
                  {formatCurrency(Number(booking.room?.room_type?.base_price || 0) * nights)}
                </span>
              </div>
              <div className="mt-3 flex justify-between border-t border-amber-200 pt-3 text-lg font-black">
                <span>Tổng cộng</span>
                <span className="text-amber-700">{formatCurrency(Number(booking.total_price))}</span>
              </div>
            </div>

            {canCancel && booking.status !== 'cancelled' && booking.status !== 'checked_out' && (
              <BookingActionButton
                action={cancelBooking.bind(null, booking.id)}
                label="Hủy booking"
                variant="destructive"
                className="w-full"
              />
            )}
            <Link href={`/booking/${booking.id}/print`} target="_blank">
              <Button variant="outline" className="w-full border-amber-300 font-semibold">
                In phiếu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-100 p-3">
      <div className="text-amber-700">{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  )
}
