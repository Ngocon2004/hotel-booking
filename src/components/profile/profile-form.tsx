'use client'

import { useActionState, useRef, useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateProfile, uploadAvatar } from '@/server/actions/profile'
import type { Profile } from '@/types/database'

type Props = {
  profile: Profile
  email: string
}

export default function ProfileForm({ profile, email }: Props) {
  const [state, formAction, pending] = useActionState(updateProfile, undefined)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const initials =
    profile.full_name
      ?.split(' ')
      .map((part) => part[0])
      .slice(-2)
      .join('')
      .toUpperCase() || email.charAt(0).toUpperCase()

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadAvatar(formData)
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''

    if (result.error) {
      toast.error(result.error)
      return
    }
    if (result.url) {
      setAvatarUrl(result.url)
      toast.success('Da upload avatar')
    }
  }

  return (
    <Card className="border-amber-100">
      <CardHeader>
        <CardTitle>Ho so ca nhan</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="avatar_url" value={avatarUrl} />

          <div className="flex flex-wrap items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-amber-200">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="bg-amber-100 text-lg font-bold text-amber-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label
                htmlFor="avatar"
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-amber-200 px-3 text-sm font-semibold hover:bg-amber-50"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload avatar
              </Label>
              <input
                ref={inputRef}
                id="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
              <p className="mt-1 text-xs text-gray-500">JPG, PNG, WEBP toi da 3MB.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Ho ten *</Label>
              <Input id="full_name" name="full_name" defaultValue={profile.full_name || ''} required />
              {state?.errors?.full_name && (
                <p className="text-sm text-red-600">{state.errors.full_name[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">So dien thoai</Label>
            <Input id="phone" name="phone" defaultValue={profile.phone || ''} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dia chi</Label>
            <Textarea id="address" name="address" rows={4} defaultValue={profile.address || ''} />
          </div>

          {state?.errors?._form && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.errors._form[0]}
            </div>
          )}
          {state?.success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {state.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={pending || uploading}
            className="bg-gradient-to-r from-amber-500 to-amber-700 font-semibold hover:from-amber-600 hover:to-amber-800"
          >
            {pending ? 'Dang luu...' : 'Luu ho so'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
