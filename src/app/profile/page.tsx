import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/profile/profile-form'
import type { Profile } from '@/types/database'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/profile')

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!data) redirect('/')

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight">Ho so ca nhan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Cap nhat thong tin lien he va anh dai dien cua ban.
        </p>
      </div>
      <ProfileForm profile={data as Profile} email={user.email || ''} />
    </div>
  )
}
