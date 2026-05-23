'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import ImageUploader from './image-uploader'
import type { Room, RoomType } from '@/types/database'
import type { FormState } from '@/lib/validators/room'

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  initial?: Room
  roomTypes: RoomType[]
  title: string
}

export default function RoomForm({ action, initial, roomTypes, title }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/rooms">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
      </div>

      <form action={formAction} className="space-y-6">
        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle>Thông tin phòng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room_number">Số phòng *</Label>
                <Input
                  id="room_number"
                  name="room_number"
                  defaultValue={initial?.room_number}
                  placeholder="101, 201A..."
                  required
                />
                {state?.errors?.room_number && (
                  <p className="text-sm text-red-600">{state.errors.room_number[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Tầng</Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  min="1"
                  defaultValue={initial?.floor || ''}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select name="status" defaultValue={initial?.status || 'available'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Sẵn sàng</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room_type_id">Loại phòng *</Label>
              <Select
                name="room_type_id"
                defaultValue={initial?.room_type_id}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại phòng" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((rt) => (
                    <SelectItem key={rt.id} value={rt.id}>
                      {rt.name} - {new Intl.NumberFormat('vi-VN').format(rt.base_price)} VND/đêm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.room_type_id && (
                <p className="text-sm text-red-600">{state.errors.room_type_id[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả phòng</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={initial?.description || ''}
                placeholder="Mô tả ngắn về phòng..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle>Hình ảnh phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader initial={initial?.images || []} max={6} />
          </CardContent>
        </Card>

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
            {pending ? 'Đang lưu...' : initial ? 'Cập nhật' : 'Tạo phòng'}
          </Button>
          <Link href="/admin/rooms">
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
