import { redirect } from 'next/navigation'
import { ArrowLeft, BedDouble, Users } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BookingForm from '@/components/booking/booking-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { bookingSearchSchema } from '@/lib/validators/booking'
import { formatCurrency } from '@/lib/utils/format'
import type { Room, RoomType, Service } from '@/types/database'

type Params = Promise<{ roomId: string }>
type SearchParams = Promise<{
  check_in?: string
  check_out?: string
  guests?: string
}>

type RoomWithType = Room & {
  room_type: RoomType | null
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { roomId } = await params
  const query = await searchParams
  const parsed = bookingSearchSchema.safeParse({
    check_in: query.check_in,
    check_out: query.check_out,
    guests: query.guests || '1',
  })

  if (!parsed.success) {
    redirect(`/rooms/${roomId}`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const redirectPath = `/booking/${roomId}?check_in=${parsed.data.check_in}&check_out=${parsed.data.check_out}&guests=${parsed.data.guests}`
    redirect(
      `/auth/login?redirect=${encodeURIComponent(redirectPath)}`
    )
  }

  const [{ data: roomData }, { data: servicesData }, { data: isAvailable }] =
    await Promise.all([
      supabase
        .from('rooms')
        .select('*, room_type:room_types(*)')
        .eq('id', roomId)
        .eq('status', 'available')
        .single(),
      supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true }),
      supabase.rpc('check_room_availability', {
        p_room_id: roomId,
        p_check_in: parsed.data.check_in,
        p_check_out: parsed.data.check_out,
      }),
    ])

  const room = roomData as unknown as RoomWithType | null

  if (!room || !room.room_type || !isAvailable) {
    redirect(
      `/search?check_in=${parsed.data.check_in}&check_out=${parsed.data.check_out}&guests=${parsed.data.guests}`
    )
  }

  const cover = room.images?.[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/rooms/${roomId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Xác nhận đặt phòng</h1>
          <p className="text-sm text-gray-500">Kiểm tra thông tin trước khi tạo booking.</p>
        </div>
      </div>

      <Card className="mb-6 overflow-hidden border-amber-100">
        <CardContent className="grid gap-5 p-5 md:grid-cols-[240px_1fr]">
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-amber-50">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt={`Phòng ${room.room_number}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-amber-300">
                <BedDouble className="h-12 w-12" />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-wider text-amber-700">
              {room.room_type.name}
            </p>
            <h2 className="mt-1 text-2xl font-black">Phòng {room.room_number}</h2>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Tối đa {room.room_type.max_occupancy} khách
              </span>
              <span className="font-bold text-amber-700">
                {formatCurrency(Number(room.room_type.base_price))}/đêm
              </span>
            </div>
            {room.description && <p className="mt-3 text-sm text-gray-600">{room.description}</p>}
          </div>
        </CardContent>
      </Card>

      <BookingForm
        roomId={room.id}
        checkIn={parsed.data.check_in}
        checkOut={parsed.data.check_out}
        guests={parsed.data.guests}
        pricePerNight={Number(room.room_type.base_price)}
        maxOccupancy={room.room_type.max_occupancy}
        services={(servicesData || []) as Service[]}
      />
    </div>
  )
}
