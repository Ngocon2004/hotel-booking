'use server'

import { createClient } from '@/lib/supabase/server'
import { roomSchema, type FormState } from '@/lib/validators/room'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Bạn cần đăng nhập')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Không có quyền')
  return supabase
}

export async function createRoom(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await requireAdmin()

    const images = formData.getAll('images').map((i) => String(i)).filter(Boolean)
    const validated = roomSchema.safeParse({
      room_number: formData.get('room_number'),
      room_type_id: formData.get('room_type_id'),
      floor: formData.get('floor') || undefined,
      description: formData.get('description'),
      status: formData.get('status') || 'available',
      images,
    })

    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors }
    }

    const { error } = await supabase.from('rooms').insert({
      room_number: validated.data.room_number,
      room_type_id: validated.data.room_type_id,
      floor: validated.data.floor || null,
      description: validated.data.description || null,
      status: validated.data.status,
      images,
    })

    if (error) {
      return { errors: { _form: [error.message] } }
    }
  } catch (e) {
    return { errors: { _form: [e instanceof Error ? e.message : 'Có lỗi xảy ra'] } }
  }

  revalidatePath('/admin/rooms')
  redirect('/admin/rooms')
}

export async function updateRoom(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await requireAdmin()

    const images = formData.getAll('images').map((i) => String(i)).filter(Boolean)
    const validated = roomSchema.safeParse({
      room_number: formData.get('room_number'),
      room_type_id: formData.get('room_type_id'),
      floor: formData.get('floor') || undefined,
      description: formData.get('description'),
      status: formData.get('status') || 'available',
      images,
    })

    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors }
    }

    const { error } = await supabase
      .from('rooms')
      .update({
        room_number: validated.data.room_number,
        room_type_id: validated.data.room_type_id,
        floor: validated.data.floor || null,
        description: validated.data.description || null,
        status: validated.data.status,
        images,
      })
      .eq('id', id)

    if (error) {
      return { errors: { _form: [error.message] } }
    }
  } catch (e) {
    return { errors: { _form: [e instanceof Error ? e.message : 'Có lỗi xảy ra'] } }
  }

  revalidatePath('/admin/rooms')
  redirect('/admin/rooms')
}

export async function deleteRoom(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('rooms').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/rooms')
}

/**
 * Upload ảnh phòng lên Supabase Storage bucket 'rooms'.
 * Trả về public URL.
 */
export async function uploadRoomImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = await requireAdmin()
    const file = formData.get('file') as File | null
    if (!file || file.size === 0) return { error: 'Không có file' }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      return { error: 'Chỉ chấp nhận file JPG, PNG, WEBP' }
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'Kích thước file tối đa 5MB' }
    }

    const path = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('rooms').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })
    if (error) return { error: error.message }

    const {
      data: { publicUrl },
    } = supabase.storage.from('rooms').getPublicUrl(path)

    return { url: publicUrl }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload thất bại' }
  }
}

