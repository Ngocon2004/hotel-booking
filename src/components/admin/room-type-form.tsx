'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AMENITIES_OPTIONS, type FormState } from '@/lib/validators/room'
import type { RoomType } from '@/types/database'
import { ArrowLeft } from 'lucide-react'

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  initial?: RoomType
  title: string
}

export default function RoomTypeForm({ action, initial, title }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [selected, setSelected] = useState<string[]>(initial?.amenities || [])

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/room-types">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
      </div>

      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle>Thông tin loại phòng</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên loại phòng *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={initial?.name}
                  placeholder="Standard, Deluxe, Suite..."
                  required
                />
                {state?.errors?.name && (
                  <p className="text-sm text-red-600">{state.errors.name[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_occupancy">Sức chứa tối đa *</Label>
                <Input
                  id="max_occupancy"
                  name="max_occupancy"
                  type="number"
                  min="1"
                  defaultValue={initial?.max_occupancy || 2}
                  required
                />
                {state?.errors?.max_occupancy && (
                  <p className="text-sm text-red-600">{state.errors.max_occupancy[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_price">Giá cơ bản (VND/đêm) *</Label>
              <Input
                id="base_price"
                name="base_price"
                type="number"
                min="0"
                step="10000"
                defaultValue={initial?.base_price || 0}
                placeholder="800000"
                required
              />
              {state?.errors?.base_price && (
                <p className="text-sm text-red-600">{state.errors.base_price[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={initial?.description || ''}
                placeholder="Mô tả ngắn về loại phòng này..."
              />
            </div>

            <div className="space-y-3">
              <Label>Tiện nghi</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES_OPTIONS.map((a) => {
                  const checked = selected.includes(a.key)
                  return (
                    <label
                      key={a.key}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        checked
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="amenities"
                        value={a.key}
                        checked={checked}
                        onChange={() => toggle(a.key)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{a.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {state?.errors?._form && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {state.errors._form[0]}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={pending}
                className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 font-semibold"
              >
                {pending ? 'Đang lưu...' : initial ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Link href="/admin/room-types">
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
