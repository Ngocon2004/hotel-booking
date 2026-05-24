import Link from 'next/link'
import { BedDouble, SearchX } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import SearchForm from '@/components/booking/search-form'
import RoomCard from '@/components/rooms/room-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { bookingSearchSchema } from '@/lib/validators/booking'

type SearchParams = Promise<{
  check_in?: string
  check_out?: string
  guests?: string
  type?: string
  min?: string
  max?: string
}>

type AvailableRoom = {
  id: string
  room_number: string
  room_type_id: string
  floor: number | null
  description: string | null
  images: string[]
  type_name: string
  base_price: number
  max_occupancy: number
  amenities: string[]
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const parsed = bookingSearchSchema.safeParse({
    check_in: params.check_in,
    check_out: params.check_out,
    guests: params.guests || '1',
  })

  const supabase = await createClient()
  const { data: roomTypes } = await supabase
    .from('room_types')
    .select('id, name, base_price')
    .order('base_price', { ascending: true })

  let rooms: AvailableRoom[] = []
  let errorMessage = ''

  if (parsed.success) {
    const { data, error } = await supabase.rpc('get_available_rooms', {
      p_check_in: parsed.data.check_in,
      p_check_out: parsed.data.check_out,
      p_guests: parsed.data.guests,
      p_room_type_id: params.type || null,
    })

    if (error) {
      errorMessage = error.message
    } else {
      rooms = ((data || []) as AvailableRoom[]).filter((room) => {
        const price = Number(room.base_price)
        if (params.min && price < Number(params.min)) return false
        if (params.max && price > Number(params.max)) return false
        return true
      })
    }
  } else if (params.check_in || params.check_out || params.guests) {
    errorMessage =
      parsed.error.flatten().formErrors[0] ||
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ||
      'Thông tin tìm kiếm không hợp lệ'
  }

  const hasSearched = Boolean(params.check_in && params.check_out)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
          <BedDouble className="h-3 w-3" />
          Tìm phòng trống
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Tìm phòng theo ngày</h1>
        <p className="mt-2 max-w-2xl text-gray-500">
          Chọn ngày lưu trú và số khách để xem các phòng còn khả dụng.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
        <SearchForm
          initialCheckIn={params.check_in}
          initialCheckOut={params.check_out}
          initialGuests={Number(params.guests || 2)}
        />

        {roomTypes && roomTypes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-amber-100 pt-4">
            <Link
              href={{
                pathname: '/search',
                query: {
                  check_in: params.check_in,
                  check_out: params.check_out,
                  guests: params.guests,
                  min: params.min,
                  max: params.max,
                },
              }}
              className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800"
            >
              Tất cả
            </Link>
            {roomTypes.map((type) => (
              <Link
                key={type.id}
                href={{
                  pathname: '/search',
                  query: {
                    check_in: params.check_in,
                    check_out: params.check_out,
                    guests: params.guests,
                    type: type.id,
                    min: params.min,
                    max: params.max,
                  },
                }}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-800"
              >
                {type.name}
              </Link>
            ))}
          </div>
        )}

        <form action="/search" className="mt-4 grid gap-3 border-t border-amber-100 pt-4 sm:grid-cols-[1fr_1fr_auto]">
          <input type="hidden" name="check_in" value={params.check_in || ''} />
          <input type="hidden" name="check_out" value={params.check_out || ''} />
          <input type="hidden" name="guests" value={params.guests || '2'} />
          {params.type && <input type="hidden" name="type" value={params.type} />}
          <Input
            name="min"
            type="number"
            min="0"
            defaultValue={params.min || ''}
            placeholder="Giá thấp nhất"
          />
          <Input
            name="max"
            type="number"
            min="0"
            defaultValue={params.max || ''}
            placeholder="Giá cao nhất"
          />
          <Button type="submit" variant="outline" className="border-amber-300 font-semibold">
            Lọc giá
          </Button>
        </form>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {errorMessage}
        </div>
      ) : hasSearched ? (
        rooms.length > 0 ? (
          <div>
            <p className="mb-4 text-sm text-gray-500">
              Tìm thấy <strong>{rooms.length}</strong> phòng trống.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={{
                    id: room.id,
                    room_number: room.room_number,
                    images: room.images || [],
                    description: room.description,
                    room_type: {
                      name: room.type_name,
                      base_price: Number(room.base_price),
                      max_occupancy: room.max_occupancy,
                      amenities: room.amenities || [],
                    },
                  }}
                  bookingHref={`/booking/${room.id}?check_in=${parsed.success ? parsed.data.check_in : ''}&check_out=${parsed.success ? parsed.data.check_out : ''}&guests=${parsed.success ? parsed.data.guests : 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-12 text-center">
            <SearchX className="mx-auto mb-3 h-12 w-12 text-amber-300" />
            <p className="font-semibold">Không có phòng trống trong khoảng ngày này</p>
            <p className="mt-1 text-sm text-gray-500">
              Hãy thử đổi ngày lưu trú hoặc giảm số khách.
            </p>
          </div>
        )
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-12 text-center">
          <BedDouble className="mx-auto mb-3 h-12 w-12 text-amber-300" />
          <p className="font-semibold">Nhập ngày lưu trú để bắt đầu tìm kiếm</p>
        </div>
      )}
    </div>
  )
}
