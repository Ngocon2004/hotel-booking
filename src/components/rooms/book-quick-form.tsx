'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils/format'
import dayjs from 'dayjs'
import { Calendar, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { checkRoomAvailability } from '@/server/actions/bookings'

type Props = {
  roomId: string
  pricePerNight: number
  maxOccupancy: number
}

export default function BookQuickForm({ roomId, pricePerNight, maxOccupancy }: Props) {
  const router = useRouter()
  const today = dayjs().format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [guests, setGuests] = useState(2)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')

  const nights = useMemo(() => {
    const ci = dayjs(checkIn)
    const co = dayjs(checkOut)
    return Math.max(0, co.diff(ci, 'day'))
  }, [checkIn, checkOut])

  const total = nights * pricePerNight

  const handleBook = async () => {
    if (nights <= 0) return
    setError('')
    setIsChecking(true)

    const result = await checkRoomAvailability(roomId, checkIn, checkOut)
    setIsChecking(false)

    if (!result.available) {
      setError(result.error || 'Phòng đã có người đặt trong khoảng ngày này')
      return
    }

    const params = new URLSearchParams({
      check_in: checkIn,
      check_out: checkOut,
      guests: String(guests),
    })
    router.push(`/booking/${roomId}?${params.toString()}`)
  }

  return (
    <Card className="border-amber-200 shadow-xl sticky top-20">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-baseline justify-between border-b border-amber-100 pb-3">
          <div>
            <p className="text-3xl font-black text-amber-700">
              {formatCurrency(pricePerNight)}
            </p>
            <p className="text-sm text-gray-500">/ đêm</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Check-in
            </Label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => {
                setError('')
                setCheckIn(e.target.value)
              }}
              className="w-full h-10 px-2 rounded-md border border-input bg-background text-sm font-semibold"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Check-out
            </Label>
            <input
              type="date"
              min={dayjs(checkIn).add(1, 'day').format('YYYY-MM-DD')}
              value={checkOut}
              onChange={(e) => {
                setError('')
                setCheckOut(e.target.value)
              }}
              className="w-full h-10 px-2 rounded-md border border-input bg-background text-sm font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 flex items-center gap-1">
            <Users className="w-3 h-3" /> Số khách (tối đa {maxOccupancy})
          </Label>
          <input
            type="number"
            min="1"
            max={maxOccupancy}
            value={guests}
            onChange={(e) =>
              setGuests(Math.min(maxOccupancy, Math.max(1, Number(e.target.value))))
            }
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-semibold"
          />
        </div>

        {/* Tóm tắt giá */}
        {nights > 0 && (
          <div className="bg-amber-50 rounded-lg p-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {formatCurrency(pricePerNight)} × {nights} đêm
              </span>
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between font-black text-base pt-2 border-t border-amber-200">
              <span>Tổng cộng</span>
              <span className="text-amber-700">{formatCurrency(total)}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleBook}
          disabled={nights <= 0 || isChecking}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 font-bold h-11"
        >
          {isChecking ? 'Đang kiểm tra...' : nights > 0 ? 'Đặt phòng ngay' : 'Vui lòng chọn ngày'}
        </Button>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <p className="text-[10px] text-center text-gray-400">
          Bạn chưa bị tính phí - chỉ xác nhận sau khi đặt
        </p>
      </CardContent>
    </Card>
  )
}
