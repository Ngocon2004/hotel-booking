import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils/format'
import { getAmenityLabel } from '@/lib/validators/room'
import { BedDouble, Users, Wifi, ImageIcon } from 'lucide-react'

type Props = {
  room: {
    id: string
    room_number: string
    images: string[]
    description: string | null
    room_type?: {
      name: string
      base_price: number
      max_occupancy: number
      amenities: string[]
    } | null
  }
  rating?: number
  reviewCount?: number
  bookingHref?: string
}

export default function RoomCard({ room, rating, reviewCount, bookingHref }: Props) {
  const cover = room.images?.[0]
  const type = room.room_type

  return (
    <Link href={bookingHref || `/rooms/${room.id}`} className="group block">
      <Card className="overflow-hidden border-amber-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full">
        {/* Cover image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={`Phòng ${room.room_number}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-amber-200">
              <ImageIcon className="w-16 h-16" />
            </div>
          )}

          {/* Type badge */}
          {type && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/95 text-amber-800 hover:bg-white shadow-md font-bold">
                {type.name}
              </Badge>
            </div>
          )}

          {/* Rating */}
          {rating !== undefined && rating > 0 && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500/95 text-white rounded-md text-xs font-bold flex items-center gap-1">
              ⭐ {rating.toFixed(1)}
              {reviewCount && <span className="opacity-80">({reviewCount})</span>}
            </div>
          )}
        </div>

        <CardContent className="p-5 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-black tracking-tight">
                Phòng {room.room_number}
              </h3>
              {type && (
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {type.max_occupancy} người
                  </span>
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-3 h-3" />1 giường lớn
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2">
            {room.description || type?.name + ' - Trang bị đầy đủ tiện nghi cao cấp.'}
          </p>

          {/* Amenities preview */}
          {type?.amenities && type.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {type.amenities.slice(0, 3).map((a) => (
                <span
                  key={a}
                  className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-semibold"
                >
                  {getAmenityLabel(a)}
                </span>
              ))}
              {type.amenities.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-semibold">
                  +{type.amenities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-end justify-between pt-2 border-t border-amber-100">
            <div>
              <span className="text-xs text-gray-500">Từ</span>
              <p className="text-xl font-black text-amber-700">
                {type ? formatCurrency(type.base_price) : '—'}
              </p>
              <span className="text-xs text-gray-500">/ đêm</span>
            </div>
            <span className="text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
              {bookingHref ? 'Đặt ngay →' : 'Xem chi tiết →'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
