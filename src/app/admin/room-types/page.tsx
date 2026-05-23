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
import { getAmenityLabel } from '@/lib/validators/room'
import { Plus, Pencil } from 'lucide-react'
import DeleteRoomTypeButton from './delete-button'

export default async function RoomTypesPage() {
  const supabase = await createClient()
  const { data: roomTypes } = await supabase
    .from('room_types')
    .select('*')
    .order('base_price', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Loại phòng</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các loại phòng (Standard, Deluxe, Suite...).
          </p>
        </div>
        <Link href="/admin/room-types/new">
          <Button className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 font-semibold">
            <Plus className="w-4 h-4 mr-1" />
            Thêm loại phòng
          </Button>
        </Link>
      </div>

      <Card className="border-amber-100">
        <CardContent className="p-0">
          {roomTypes && roomTypes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-50/50 hover:bg-amber-50/50">
                  <TableHead className="font-bold">Tên</TableHead>
                  <TableHead className="font-bold">Giá / đêm</TableHead>
                  <TableHead className="font-bold">Sức chứa</TableHead>
                  <TableHead className="font-bold">Tiện nghi</TableHead>
                  <TableHead className="text-right font-bold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomTypes.map((rt: any) => (
                  <TableRow key={rt.id}>
                    <TableCell>
                      <div>
                        <div className="font-bold">{rt.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {rt.description || '—'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-amber-700">
                      {formatCurrency(rt.base_price)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                        {rt.max_occupancy} người
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {(rt.amenities || []).slice(0, 4).map((a: string) => (
                          <Badge
                            key={a}
                            variant="outline"
                            className="text-[10px] border-amber-200"
                          >
                            {getAmenityLabel(a)}
                          </Badge>
                        ))}
                        {(rt.amenities || []).length > 4 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{rt.amenities.length - 4}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/room-types/${rt.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeleteRoomTypeButton id={rt.id} name={rt.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <p className="font-semibold mb-1">Chưa có loại phòng nào.</p>
              <p className="text-sm">Hãy bắt đầu bằng cách thêm loại phòng đầu tiên.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
