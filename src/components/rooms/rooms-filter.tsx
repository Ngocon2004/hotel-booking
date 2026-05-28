'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { SlidersHorizontal, X } from 'lucide-react'
import type { RoomType } from '@/types/database'

type Props = {
  roomTypes: RoomType[]
}

export default function RoomsFilter({ roomTypes }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const [type, setType] = useState(searchParams.get('type') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'price_asc')

  const apply = () => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (minPrice) params.set('min', minPrice)
    if (maxPrice) params.set('max', maxPrice)
    if (sort && sort !== 'price_asc') params.set('sort', sort)

    startTransition(() => {
      router.push(`/rooms${params.toString() ? `?${params.toString()}` : ''}`)
    })
  }

  const reset = () => {
    setType('')
    setMinPrice('')
    setMaxPrice('')
    setSort('price_asc')
    startTransition(() => {
      router.push('/rooms')
    })
  }

  const hasFilters = type || minPrice || maxPrice || (sort && sort !== 'price_asc')

  return (
    <Card className="border-amber-100 sticky top-20">
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-black flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
          </h3>
          {hasFilters && (
            <button
              onClick={reset}
              className="text-xs text-amber-700 font-semibold hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Xoá
            </button>
          )}
        </div>

        {/* Loại phòng */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider font-bold">Loại phòng</Label>
          <Select
            value={type || 'all'}
            onValueChange={(v) => setType(!v || v === 'all' ? '' : String(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {roomTypes.map((rt) => (
                <SelectItem key={rt.id} value={rt.id}>
                  {rt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Khoảng giá */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider font-bold">Khoảng giá (VND)</Label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              step="100000"
              placeholder="Từ"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            />
            <input
              type="number"
              min="0"
              step="100000"
              placeholder="Đến"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            />
          </div>
        </div>

        {/* Sắp xếp */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider font-bold">Sắp xếp</Label>
          <Select value={sort} onValueChange={(v) => setSort(String(v || 'price_asc'))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Giá thấp → cao</SelectItem>
              <SelectItem value="price_desc">Giá cao → thấp</SelectItem>
              <SelectItem value="rating">Đánh giá cao</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={apply}
          disabled={pending}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 font-semibold"
        >
          {pending ? 'Đang lọc...' : 'Áp dụng'}
        </Button>
      </CardContent>
    </Card>
  )
}
