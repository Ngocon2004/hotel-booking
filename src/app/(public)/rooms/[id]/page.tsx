import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import RoomGallery from '@/components/rooms/room-gallery'
import BookQuickForm from '@/components/rooms/book-quick-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getAmenityLabel } from '@/lib/validators/room'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import {
  Users,
  BedDouble,
  Star,
  CheckCircle,
  MapPin,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import RealtimeRoomStatus from '@/components/rooms/realtime-room-status'

type RoomReview = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  customer: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch room + room_type
  const { data: room } = await supabase
    .from('rooms')
    .select(
      `*,
      room_type:room_types(*)`
    )
    .eq('id', id)
    .single()

  if (!room || !room.room_type) notFound()

  // Fetch reviews cho phòng này (qua bookings)
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', id)

  const bookingIds = (bookings || []).map((b) => b.id)
  const { data: reviews } = bookingIds.length
    ? await supabase
        .from('reviews')
        .select(
          `*,
          customer:profiles(full_name, avatar_url)`
        )
        .in('booking_id', bookingIds)
        .order('created_at', { ascending: false })
        .limit(10)
    : { data: [] }

  const typedReviews = (reviews || []) as unknown as RoomReview[]
  const avgRating =
    typedReviews.length > 0
      ? typedReviews.reduce((s, r) => s + r.rating, 0) / typedReviews.length
      : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        href="/rooms"
        className="inline-flex items-center gap-1 text-sm text-amber-700 font-semibold hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách phòng
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold">
            {room.room_type.name}
          </Badge>
          {room.floor && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Tầng {room.floor}
            </span>
          )}
          <RealtimeRoomStatus roomId={room.id} initialStatus={room.status} />
          {avgRating > 0 && (
            <span className="text-sm text-amber-600 flex items-center gap-1 font-semibold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              {avgRating.toFixed(1)} ({typedReviews.length} đánh giá)
            </span>
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Phòng {room.room_number}
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Left: gallery + info */}
        <div className="space-y-8 min-w-0">
          <RoomGallery
            images={room.images || []}
            alt={`Phòng ${room.room_number}`}
          />

          {/* Mô tả + tiện nghi */}
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>Mô tả phòng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-amber-50">
                  <BedDouble className="w-5 h-5 text-amber-600 mb-1" />
                  <p className="text-xs uppercase tracking-wider font-bold text-gray-500">
                    Loại phòng
                  </p>
                  <p className="font-black">{room.room_type.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50">
                  <Users className="w-5 h-5 text-amber-600 mb-1" />
                  <p className="text-xs uppercase tracking-wider font-bold text-gray-500">
                    Sức chứa
                  </p>
                  <p className="font-black">{room.room_type.max_occupancy} người</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50">
                  <Star className="w-5 h-5 text-amber-600 mb-1" />
                  <p className="text-xs uppercase tracking-wider font-bold text-gray-500">
                    Giá
                  </p>
                  <p className="font-black">{formatCurrency(room.room_type.base_price)}</p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {room.description ||
                  room.room_type.description ||
                  `Phòng ${room.room_type.name} đẳng cấp với đầy đủ tiện nghi cao cấp. Trải nghiệm dịch vụ 5 sao với view đẹp và không gian sang trọng.`}
              </p>

              {/* Tiện nghi */}
              {room.room_type.amenities && room.room_type.amenities.length > 0 && (
                <div>
                  <h4 className="font-black mb-3">Tiện nghi phòng</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {room.room_type.amenities.map((a: string) => (
                      <div
                        key={a}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm font-medium">{getAmenityLabel(a)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Đánh giá từ khách</span>
                {avgRating > 0 && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                    <span className="font-black">{avgRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500 font-normal">
                      ({typedReviews.length})
                    </span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typedReviews.length > 0 ? (
                <div className="space-y-4">
                  {typedReviews.map((r) => {
                    const initials =
                      r.customer?.full_name
                        ?.split(' ')
                        .map((n: string) => n[0])
                        .slice(-2)
                        .join('')
                        .toUpperCase() || 'K'
                    return (
                      <div
                        key={r.id}
                        className="flex gap-3 pb-4 border-b border-amber-50 last:border-0 last:pb-0"
                      >
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback className="bg-amber-100 text-amber-700 font-bold text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm">
                              {r.customer?.full_name || 'Khách ẩn danh'}
                            </p>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < r.rating
                                      ? 'fill-amber-500 text-amber-500'
                                      : 'text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mb-1">
                            {formatDate(r.created_at)}
                          </p>
                          {r.comment && (
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {r.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-semibold">Chưa có đánh giá nào</p>
                  <p className="text-xs">Hãy là người đầu tiên đánh giá phòng này!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Booking form */}
        <BookQuickForm
          roomId={room.id}
          pricePerNight={Number(room.room_type.base_price)}
          maxOccupancy={room.room_type.max_occupancy}
        />
      </div>
    </div>
  )
}
