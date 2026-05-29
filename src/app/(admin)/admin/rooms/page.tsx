import Link from 'next/link'
import { BedDouble, Pencil, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import RealtimeRoomsToast from '@/components/rooms/realtime-rooms-toast'
import RealtimeRoomStatus from '@/components/rooms/realtime-room-status'
import DeleteRoomButton from './delete-button'
import { formatCurrency } from '@/lib/utils/format'

type RoomRow = {
  id: string
  room_number: string
  images: string[]
  floor: number | null
  status: 'available' | 'maintenance'
  room_type: {
    name: string
    base_price: number
    max_occupancy: number
  } | null
}

export default async function RoomsPage() {
  const supabase = await createClient()
  const { data: rooms } = await supabase
    .from('rooms')
    .select(
      `*,
      room_type:room_types(name, base_price, max_occupancy)`
    )
    .order('room_number', { ascending: true })

  const rows = (rooms || []) as unknown as RoomRow[]

  return (
    <div className="space-y-6">
      <RealtimeRoomsToast />
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Phòng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý các phòng vật lý trong khách sạn.
          </p>
        </div>
        <Link href="/admin/rooms/new">
          <Button className="bg-gradient-to-r from-amber-500 to-amber-700 font-semibold hover:from-amber-600 hover:to-amber-800">
            <Plus className="mr-1 h-4 w-4" />
            Thêm phòng
          </Button>
        </Link>
      </div>

      <Card className="border-amber-100">
        <CardContent className="p-0">
          {rows.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50/50 hover:bg-amber-50/50">
                  <TableHead className="font-bold">Ảnh</TableHead>
                  <TableHead className="font-bold">Số phòng</TableHead>
                  <TableHead className="font-bold">Loại</TableHead>
                  <TableHead className="font-bold">Giá</TableHead>
                  <TableHead className="font-bold">Tầng</TableHead>
                  <TableHead className="font-bold">Trạng thái</TableHead>
                  <TableHead className="text-right font-bold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      {room.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={room.images[0]}
                          alt={`Phòng ${room.room_number}`}
                          className="h-14 w-14 rounded-lg border border-amber-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-50 text-amber-300">
                          <BedDouble className="h-6 w-6" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-base font-bold">{room.room_number}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {room.room_type?.name || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-amber-700">
                      {room.room_type ? formatCurrency(room.room_type.base_price) : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {room.floor ? `Tầng ${room.floor}` : '-'}
                    </TableCell>
                    <TableCell>
                      <RealtimeRoomStatus roomId={room.id} initialStatus={room.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/rooms/${room.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteRoomButton id={room.id} roomNumber={room.room_number} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <BedDouble className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p className="mb-1 font-semibold">Chưa có phòng nào.</p>
              <p className="text-sm">Hãy thêm phòng đầu tiên cho khách sạn của bạn.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
