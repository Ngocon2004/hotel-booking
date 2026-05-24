'use client'

import { useActionState, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Calendar, ConciergeBell, CreditCard, Users } from 'lucide-react'
import { createBooking } from '@/server/actions/bookings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/utils/format'
import type { BookingFormState } from '@/lib/validators/booking'
import type { Service } from '@/types/database'

type Props = {
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  pricePerNight: number
  maxOccupancy: number
  services: Service[]
}

export default function BookingForm({
  roomId,
  checkIn,
  checkOut,
  guests,
  pricePerNight,
  maxOccupancy,
  services,
}: Props) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const action = createBooking.bind(null, roomId)
  const [state, formAction, pending] = useActionState<BookingFormState, FormData>(
    action,
    undefined
  )

  const nights = Math.max(1, dayjs(checkOut).diff(dayjs(checkIn), 'day'))
  const servicesTotal = useMemo(
    () =>
      services
        .filter((service) => selectedServices.includes(service.id))
        .reduce((sum, service) => sum + Number(service.price), 0),
    [selectedServices, services]
  )
  const roomTotal = nights * pricePerNight
  const total = roomTotal + servicesTotal

  function toggleService(id: string, checked: boolean) {
    setSelectedServices((current) =>
      checked ? [...current, id] : current.filter((serviceId) => serviceId !== id)
    )
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <input type="hidden" name="check_in" value={checkIn} />
      <input type="hidden" name="check_out" value={checkOut} />

      <div className="space-y-6">
        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle>Thông tin lưu trú</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Check-in
              </Label>
              <Input value={checkIn} readOnly />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Check-out
              </Label>
              <Input value={checkOut} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Số khách
              </Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max={maxOccupancy}
                defaultValue={Math.min(guests, maxOccupancy)}
                required
              />
              {state?.errors?.guests && (
                <p className="text-sm text-red-600">{state.errors.guests[0]}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ConciergeBell className="h-5 w-5 text-amber-700" />
              Dịch vụ kèm theo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-amber-100 p-4 transition-colors hover:bg-amber-50"
                  >
                    <input
                      type="checkbox"
                      name="services"
                      value={service.id}
                      checked={selectedServices.includes(service.id)}
                      onChange={(event) => toggleService(service.id, event.target.checked)}
                      className="mt-1 h-4 w-4 accent-amber-600"
                    />
                    <span className="flex-1">
                      <span className="block font-bold">{service.name}</span>
                      {service.description && (
                        <span className="mt-1 block text-sm text-gray-500">
                          {service.description}
                        </span>
                      )}
                      <span className="mt-2 block text-sm font-bold text-amber-700">
                        {formatCurrency(Number(service.price))}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa có dịch vụ kèm theo.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle>Yêu cầu đặc biệt</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="special_requests"
              rows={4}
              placeholder="Ví dụ: cần phòng yên tĩnh, check-in sớm, chuẩn bị bánh sinh nhật..."
            />
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit border-amber-200 shadow-xl lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-700" />
            Tóm tắt thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">
                {formatCurrency(pricePerNight)} x {nights} đêm
              </span>
              <span className="font-semibold">{formatCurrency(roomTotal)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600">Dịch vụ kèm theo</span>
              <span className="font-semibold">{formatCurrency(servicesTotal)}</span>
            </div>
          </div>

          <div className="flex justify-between border-t border-amber-100 pt-4 text-lg font-black">
            <span>Tổng cộng</span>
            <span className="text-amber-700">{formatCurrency(total)}</span>
          </div>

          {state?.errors?._form && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.errors._form[0]}
            </div>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="h-11 w-full bg-gradient-to-r from-amber-500 to-amber-700 font-bold hover:from-amber-600 hover:to-amber-800"
          >
            {pending ? 'Đang đặt phòng...' : 'Xác nhận đặt phòng'}
          </Button>
          <p className="text-center text-xs text-gray-400">
            Booking ở trạng thái chờ xác nhận, chưa thu phí trực tuyến.
          </p>
        </CardContent>
      </Card>
    </form>
  )
}
