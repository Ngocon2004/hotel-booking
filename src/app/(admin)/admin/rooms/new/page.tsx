import { createClient } from '@/lib/supabase/server'
import { createRoom } from '@/server/actions/rooms'
import RoomForm from '@/components/admin/room-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function NewRoomPage() {
  const supabase = await createClient()
  const { data: roomTypes } = await supabase
    .from('room_types')
    .select('*')
    .order('base_price', { ascending: true })

  if (!roomTypes || roomTypes.length === 0) {
    return (
      <Card className="border-amber-100">
        <CardContent className="p-12 text-center">
          <p className="text-lg font-semibold mb-2">Chưa có loại phòng nào.</p>
          <p className="text-sm text-gray-500 mb-6">
            Bạn cần tạo ít nhất 1 loại phòng trước khi tạo phòng vật lý.
          </p>
          <Link href="/admin/room-types/new">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-700">
              Tạo loại phòng
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return <RoomForm action={createRoom} roomTypes={roomTypes} title="Thêm phòng mới" />
}
