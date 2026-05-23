import { createClient } from '@/lib/supabase/server'
import { updateRoomType } from '@/app/actions/room-types'
import RoomTypeForm from '@/components/admin/room-type-form'
import { notFound } from 'next/navigation'
import type { FormState } from '@/lib/validators/room'

export default async function EditRoomTypePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: roomType } = await supabase
    .from('room_types')
    .select('*')
    .eq('id', id)
    .single()

  if (!roomType) notFound()

  // Bind id vào action
  const action = async (prev: FormState, formData: FormData) => {
    'use server'
    return updateRoomType(id, prev, formData)
  }

  return (
    <RoomTypeForm
      action={action}
      initial={roomType}
      title={`Chỉnh sửa: ${roomType.name}`}
    />
  )
}
