'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { serviceSchema, type ServiceFormState } from '@/lib/validators/service'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Ban can dang nhap')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Khong co quyen')
  return supabase
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Thao tac that bai'
}

function parseServiceForm(formData: FormData) {
  return serviceSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    icon: formData.get('icon'),
    is_active: formData.get('is_active') === 'on',
  })
}

export async function createService(
  _prev: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  try {
    const supabase = await requireAdmin()
    const validated = parseServiceForm(formData)

    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors }
    }

    const { error } = await supabase.from('services').insert({
      name: validated.data.name,
      description: validated.data.description || null,
      price: validated.data.price,
      icon: validated.data.icon || null,
      is_active: validated.data.is_active,
    })

    if (error) return { errors: { _form: [error.message] } }
  } catch (error) {
    return { errors: { _form: [getErrorMessage(error)] } }
  }

  revalidatePath('/admin/services')
  redirect('/admin/services')
}

export async function updateService(
  id: string,
  _prev: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  try {
    const supabase = await requireAdmin()
    const validated = parseServiceForm(formData)

    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors }
    }

    const { error } = await supabase
      .from('services')
      .update({
        name: validated.data.name,
        description: validated.data.description || null,
        price: validated.data.price,
        icon: validated.data.icon || null,
        is_active: validated.data.is_active,
      })
      .eq('id', id)

    if (error) return { errors: { _form: [error.message] } }
  } catch (error) {
    return { errors: { _form: [getErrorMessage(error)] } }
  }

  revalidatePath('/admin/services')
  redirect('/admin/services')
}

export async function deleteService(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/services')
}
