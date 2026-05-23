import { createRoomType } from '@/app/actions/room-types'
import RoomTypeForm from '@/components/admin/room-type-form'

export default function NewRoomTypePage() {
  return <RoomTypeForm action={createRoomType} title="Thêm loại phòng mới" />
}
