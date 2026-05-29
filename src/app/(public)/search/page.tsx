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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-950 dark:text-white">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
          <BedDouble className="h-3 w-3" />
          Tìm phòng trống
        </div>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Tìm phòng theo ngày</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Chọn ngày lưu trú và số khách để xem các phòng còn khả dụng.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 text-slate-950 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-white">
        <SearchForm
          initialCheckIn={params.check_in}
          initialCheckOut={params.check_out}
          initialGuests={Number(params.guests || 2)}
        />

        {roomTypes && roomTypes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
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
              className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-200"
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
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-blue-500/15 dark:hover:text-blue-200"
              >
                {type.name}
              </Link>
            ))}
          </div>
        )}

        <form action="/search" className="mt-4 grid gap-3 border-t border-slate-200 pt-4 dark:border-white/10 sm:grid-cols-[1fr_1fr_auto]">
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
            className="h-11 bg-white text-slate-950 placeholder:text-slate-500 [color-scheme:light] dark:bg-white/10 dark:text-white dark:placeholder:text-slate-300 dark:[color-scheme:dark]"
          />
          <Input
            name="max"
            type="number"
            min="0"
            defaultValue={params.max || ''}
            placeholder="Giá cao nhất"
            className="h-11 bg-white text-slate-950 placeholder:text-slate-500 [color-scheme:light] dark:bg-white/10 dark:text-white dark:placeholder:text-slate-300 dark:[color-scheme:dark]"
          />
          <Button type="submit" variant="outline" className="h-11 border-blue-200 font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-400/40 dark:text-blue-200 dark:hover:bg-blue-500/15">
            Lọc giá
          </Button>
        </form>
      </div>

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200">
          {errorMessage}
        </div>
      ) : hasSearched ? (
        rooms.length > 0 ? (
          <div>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
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
          <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/70 p-12 text-center text-slate-950 dark:border-blue-400/40 dark:bg-white/10 dark:text-white">
            <SearchX className="mx-auto mb-3 h-12 w-12 text-blue-500 dark:text-blue-300" />
            <p className="font-semibold">Không có phòng trống trong khoảng ngày này</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Hãy thử đổi ngày lưu trú hoặc giảm số khách.
            </p>
          </div>
        )
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/70 p-12 text-center text-slate-950 dark:border-blue-400/40 dark:bg-white/10 dark:text-white">
          <BedDouble className="mx-auto mb-3 h-12 w-12 text-blue-500 dark:text-blue-300" />
          <p className="font-semibold">Nhập ngày lưu trú để bắt đầu tìm kiếm</p>
        </div>
      )}
    </div>
  )
}
