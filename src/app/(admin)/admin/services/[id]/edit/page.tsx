import { redirect } from 'next/navigation'
import ServiceForm from '@/components/admin/service-form'
import { createClient } from '@/lib/supabase/server'
import { updateService } from '@/server/actions/services'
import type { Service } from '@/types/database'

type Params = Promise<{ id: string }>

export default async function EditServicePage({ params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('services').select('*').eq('id', id).single()
  if (!data) redirect('/admin/services')

  return (
    <ServiceForm
      action={updateService.bind(null, id)}
      initial={data as Service}
      title="Cap nhat dich vu"
    />
  )
}
