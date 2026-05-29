'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { profileSchema, type ProfileFormState } from '@/lib/validators/profile'

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Bạn cần đăng nhập')
  return { supabase, user }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Thao tác thất bại'
}

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  try {
    const { supabase, user } = await requireUser()
    const validated = profileSchema.safeParse({
      full_name: formData.get('full_name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      avatar_url: formData.get('avatar_url'),
    })

    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: validated.data.full_name,
        phone: validated.data.phone || null,
        address: validated.data.address || null,
        avatar_url: validated.data.avatar_url || null,
      })
      .eq('id', user.id)

    if (error) return { errors: { _form: [error.message] } }

    revalidatePath('/profile')
    revalidatePath('/', 'layout')
    return { success: true, message: 'Da cap nhat ho so' }
  } catch (error) {
    return { errors: { _form: [getErrorMessage(error)] } }
  }
}

export async function uploadAvatar(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    const { supabase, user } = await requireUser()
    const file = formData.get('file') as File | null
    if (!file || file.size === 0) return { error: 'Không có file' }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      return { error: 'Chi chap nhan JPG, PNG, WEBP' }
    }
    if (file.size > 3 * 1024 * 1024) {
      return { error: 'Kich thuoc file toi da 3MB' }
    }

    const path = `${user.id}/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })
    if (error) return { error: error.message }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(path)

    return { url: publicUrl }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
