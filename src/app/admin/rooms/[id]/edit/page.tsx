import { createClient } from '@/lib/supabase/server'
import { updateRoom } from '@/app/actions/rooms'
import RoomForm from '@/components/admin/room-form'
import { notFound } from 'next/navigation'
import type { FormState } from '@/lib/validators/room'

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [roomRes, typesRes] = await Promise.all([
    supabase.from('rooms').select('*').eq('id', id).single(),
    supabase.from('room_types').select('*').order('base_price', { ascending: true }),
  ])

  if (!roomRes.data) notFound()

  const action = async (prev: FormState, formData: FormData) => {
    'use server'
    return updateRoom(id, prev, formData)
  }

  return (
    <RoomForm
      action={action}
      initial={roomRes.data}
      roomTypes={typesRes.data || []}
      title={`Chỉnh sửa: Phòng ${roomRes.data.room_number}`}
    />
  )
}
