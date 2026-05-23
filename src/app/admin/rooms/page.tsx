import Link from 'next/link'
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
import { formatCurrency } from '@/lib/utils/format'
import { Plus, Pencil, BedDouble } from 'lucide-react'
import DeleteRoomButton from './delete-button'

export default async function RoomsPage() {
  const supabase = await createClient()
  const { data: rooms } = await supabase
    .from('rooms')
    .select(
      `*,
      room_type:room_types(name, base_price, max_occupancy)`
    )
    .order('room_number', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Phòng</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các phòng vật lý trong khách sạn.
          </p>
        </div>
        <Link href="/admin/rooms/new">
          <Button className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 font-semibold">
            <Plus className="w-4 h-4 mr-1" />
            Thêm phòng
          </Button>
        </Link>
      </div>

      <Card className="border-amber-100">
        <CardContent className="p-0">
          {rooms && rooms.length > 0 ? (
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
                {rooms.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      {r.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.images[0]}
                          alt={r.room_number}
                          className="w-14 h-14 rounded-lg object-cover border border-amber-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-amber-50 flex items-center justify-center text-amber-300">
                          <BedDouble className="w-6 h-6" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-base">{r.room_number}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {r.room_type?.name || '—'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-amber-700">
                      {r.room_type ? formatCurrency(r.room_type.base_price) : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {r.floor ? `Tầng ${r.floor}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          r.status === 'available'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }
                      >
                        {r.status === 'available' ? 'Sẵn sàng' : 'Bảo trì'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/rooms/${r.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeleteRoomButton id={r.id} roomNumber={r.room_number} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <BedDouble className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-semibold mb-1">Chưa có phòng nào.</p>
              <p className="text-sm">Hãy thêm phòng đầu tiên cho khách sạn của bạn.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
