import { createClient } from '@/lib/supabase/server'
import RoomCard from '@/components/room/room-card'
import RoomsFilter from '@/components/room/rooms-filter'
import { Suspense } from 'react'
import { BedDouble } from 'lucide-react'

type SearchParams = Promise<{
  type?: string
  min?: string
  max?: string
  sort?: string
}>

export default async function RoomsListPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Lấy room types để fill filter
  const { data: roomTypes } = await supabase
    .from('room_types')
    .select('*')
    .order('base_price', { ascending: true })

  // Build query rooms
  let query = supabase
    .from('rooms')
    .select(
      `*,
      room_type:room_types(name, base_price, max_occupancy, amenities)`
    )
    .eq('status', 'available')

  if (params.type) {
    query = query.eq('room_type_id', params.type)
  }

  // Apply sort
  switch (params.sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('room_number', { ascending: true })
  }

  const { data: roomsRaw } = await query

  // Filter by price (client-side vì giá ở room_types)
  let rooms =
    roomsRaw?.filter((r: any) => {
      if (!r.room_type) return false
      const price = r.room_type.base_price
      if (params.min && price < Number(params.min)) return false
      if (params.max && price > Number(params.max)) return false
      return true
    }) || []

  // Sort by price (client-side)
  if (params.sort === 'price_asc' || !params.sort) {
    rooms = rooms.sort(
      (a: any, b: any) => (a.room_type?.base_price || 0) - (b.room_type?.base_price || 0)
    )
  } else if (params.sort === 'price_desc') {
    rooms = rooms.sort(
      (a: any, b: any) => (b.room_type?.base_price || 0) - (a.room_type?.base_price || 0)
    )
  }

  // Lấy ratings (gom theo room_id qua bookings)
  const roomIds = rooms.map((r: any) => r.id)
  const ratingMap: Record<string, { sum: number; count: number }> = {}

  if (roomIds.length > 0) {
    // 1) Lấy bookings của các room này
    const { data: roomBookings } = await supabase
      .from('bookings')
      .select('id, room_id')
      .in('room_id', roomIds)

    if (roomBookings && roomBookings.length > 0) {
      const bookingToRoom = new Map(roomBookings.map((b) => [b.id, b.room_id]))
      // 2) Lấy reviews theo booking_id
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating, booking_id')
        .in('booking_id', Array.from(bookingToRoom.keys()))

      ;(reviews || []).forEach((r: any) => {
        const rid = bookingToRoom.get(r.booking_id)
        if (!rid) return
        ratingMap[rid] = ratingMap[rid] || { sum: 0, count: 0 }
        ratingMap[rid].sum += r.rating
        ratingMap[rid].count += 1
      })
    }
  }

  // Sort by rating nếu chọn
  if (params.sort === 'rating') {
    rooms = rooms.sort((a: any, b: any) => {
      const ra = ratingMap[a.id] ? ratingMap[a.id].sum / ratingMap[a.id].count : 0
      const rb = ratingMap[b.id] ? ratingMap[b.id].sum / ratingMap[b.id].count : 0
      return rb - ra
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
          <BedDouble className="w-3 h-3" />
          Khám phá phòng
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
          Tất cả phòng & Suite
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Khám phá hơn {rooms.length} phòng với đa dạng phong cách - từ Standard ấm cúng đến Presidential đẳng cấp.
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filter sidebar */}
        <Suspense fallback={null}>
          <RoomsFilter roomTypes={roomTypes || []} />
        </Suspense>

        {/* Grid */}
        <div>
          {rooms.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Hiển thị <strong>{rooms.length}</strong> phòng
              </p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {rooms.map((r: any) => {
                  const rating =
                    ratingMap[r.id] && ratingMap[r.id].count > 0
                      ? ratingMap[r.id].sum / ratingMap[r.id].count
                      : 0
                  return (
                    <RoomCard
                      key={r.id}
                      room={r}
                      rating={rating}
                      reviewCount={ratingMap[r.id]?.count}
                    />
                  )
                })}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-12 text-center">
              <BedDouble className="w-12 h-12 mx-auto mb-3 text-amber-300" />
              <p className="font-semibold mb-1">Không tìm thấy phòng phù hợp</p>
              <p className="text-sm text-gray-500">
                Hãy thử điều chỉnh bộ lọc để xem nhiều phòng hơn.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
