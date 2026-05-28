import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils/format'
import { getAmenityLabel } from '@/lib/validators/room'
import { BedDouble, Users, ImageIcon } from 'lucide-react'

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
    <Link href={bookingHref || `/rooms/${room.id}`} data-gsap-item className="group block">
      <Card className="overflow-hidden border-slate-200 bg-white text-slate-950 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full dark:border-white/10 dark:bg-slate-900 dark:text-white">
        {/* Cover image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-slate-100 overflow-hidden dark:from-slate-800 dark:to-slate-900">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={`Phòng ${room.room_number}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-200 dark:text-blue-300">
              <ImageIcon className="w-16 h-16" />
            </div>
          )}

          {/* Type badge */}
          {type && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/95 text-blue-700 hover:bg-white shadow-md font-bold dark:bg-slate-950/90 dark:text-blue-200">
                {type.name}
              </Badge>
            </div>
          )}

          {/* Rating */}
          {rating !== undefined && rating > 0 && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-blue-600/95 text-white rounded-md text-xs font-bold flex items-center gap-1">
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
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 dark:text-slate-300">
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
          <p className="text-sm text-slate-600 line-clamp-2 dark:text-slate-300">
            {room.description || type?.name + ' - Trang bị đầy đủ tiện nghi cao cấp.'}
          </p>

          {/* Amenities preview */}
          {type?.amenities && type.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {type.amenities.slice(0, 3).map((a) => (
                <span
                  key={a}
                  className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-semibold dark:bg-blue-500/15 dark:text-blue-200"
                >
                  {getAmenityLabel(a)}
                </span>
              ))}
              {type.amenities.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-semibold dark:bg-white/10 dark:text-slate-300">
                  +{type.amenities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-end justify-between pt-2 border-t border-slate-200 dark:border-white/10">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-300">Từ</span>
              <p className="text-xl font-black text-blue-700 dark:text-blue-300">
                {type ? formatCurrency(type.base_price) : '—'}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-300">/ đêm</span>
            </div>
            <span className="text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform dark:text-blue-300">
              {bookingHref ? 'Đặt ngay →' : 'Xem chi tiết →'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
