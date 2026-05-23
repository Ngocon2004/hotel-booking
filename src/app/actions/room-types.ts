'use server'

import { createClient } from '@/lib/supabase/server'
import { roomTypeSchema, type FormState } from '@/lib/validators/room'
import { slugify } from '@/lib/utils/format'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Helper: Kiểm tra user hiện tại có phải admin không.
 */
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

  if (profile?.role !== 'admin') throw new Error('Bạn không có quyền thực hiện hành động này')
  return supabase
}

export async function createRoomType(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await requireAdmin()

    const amenities = formData.getAll('amenities').map((a) => String(a))
    const validated = roomTypeSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      base_price: formData.get('base_price'),
      max_occupancy: formData.get('max_occupancy'),
      amenities,
    })

    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors }
    }

    const { error } = await supabase.from('room_types').insert({
      name: validated.data.name,
      slug: slugify(validated.data.name),
      description: validated.data.description || null,
      base_price: validated.data.base_price,
      max_occupancy: validated.data.max_occupancy,
      amenities,
    })

    if (error) {
      return { errors: { _form: [error.message] } }
    }
  } catch (e: any) {
    return { errors: { _form: [e.message || 'Có lỗi xảy ra'] } }
  }

  revalidatePath('/admin/room-types')
  redirect('/admin/room-types')
}

export async function updateRoomType(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await requireAdmin()

    const amenities = formData.getAll('amenities').map((a) => String(a))
    const validated = roomTypeSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      base_price: formData.get('base_price'),
      max_occupancy: formData.get('max_occupancy'),
      amenities,
    })

    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors }
    }

    const { error } = await supabase
      .from('room_types')
      .update({
        name: validated.data.name,
        slug: slugify(validated.data.name),
        description: validated.data.description || null,
        base_price: validated.data.base_price,
        max_occupancy: validated.data.max_occupancy,
        amenities,
      })
      .eq('id', id)

    if (error) {
      return { errors: { _form: [error.message] } }
    }
  } catch (e: any) {
    return { errors: { _form: [e.message || 'Có lỗi xảy ra'] } }
  }

  revalidatePath('/admin/room-types')
  redirect('/admin/room-types')
}

export async function deleteRoomType(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('room_types').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/room-types')
}
