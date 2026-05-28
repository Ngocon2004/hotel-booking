'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Service } from '@/types/database'
import type { ServiceFormState } from '@/lib/validators/service'

type Props = {
  action: (prev: ServiceFormState, formData: FormData) => Promise<ServiceFormState>
  initial?: Service
  title: string
}

export default function ServiceForm({ action, initial, title }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lai
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
      </div>

      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle>Thong tin dich vu</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Ten dich vu *</Label>
                <Input id="name" name="name" defaultValue={initial?.name} required />
                {state?.errors?.name && (
                  <p className="text-sm text-red-600">{state.errors.name[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Gia (VND) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="10000"
                  defaultValue={initial?.price || 0}
                  required
                />
                {state?.errors?.price && (
                  <p className="text-sm text-red-600">{state.errors.price[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon key</Label>
              <Input id="icon" name="icon" defaultValue={initial?.icon || ''} placeholder="coffee, car, spa" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mo ta</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={initial?.description || ''}
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={initial?.is_active ?? true}
                className="h-4 w-4 rounded border-gray-300"
              />
              Dang hoat dong
            </label>

            {state?.errors?._form && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {state.errors._form[0]}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={pending}
                className="bg-gradient-to-r from-amber-500 to-amber-700 font-semibold hover:from-amber-600 hover:to-amber-800"
              >
                {pending ? 'Dang luu...' : initial ? 'Cap nhat' : 'Tao moi'}
              </Button>
              <Link href="/admin/services">
                <Button type="button" variant="outline">
                  Huy
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
