'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { Calendar, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  initialCheckIn?: string
  initialCheckOut?: string
  initialGuests?: number
  compact?: boolean
}

export default function SearchForm({
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  compact = false,
}: Props) {
  const router = useRouter()
  const today = dayjs().format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
  const [checkIn, setCheckIn] = useState(initialCheckIn || today)
  const [checkOut, setCheckOut] = useState(initialCheckOut || tomorrow)
  const [guests, setGuests] = useState(initialGuests)

  const minCheckOut = useMemo(
    () => dayjs(checkIn || today).add(1, 'day').format('YYYY-MM-DD'),
    [checkIn, today]
  )

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams({
      check_in: checkIn,
      check_out: checkOut,
      guests: String(Math.max(1, guests)),
    })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form
      onSubmit={submitSearch}
      className={compact ? 'flex items-end gap-2' : 'grid gap-4 sm:grid-cols-[1fr_1fr_120px_auto]'}
    >
      <div className="space-y-2">
        {!compact && (
          <Label htmlFor="search_check_in" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Check-in
          </Label>
        )}
        <Input
          id="search_check_in"
          type="date"
          min={today}
          value={checkIn}
          onChange={(event) => {
            const next = event.target.value
            setCheckIn(next)
            if (dayjs(checkOut).isSame(next) || dayjs(checkOut).isBefore(next)) {
              setCheckOut(dayjs(next).add(1, 'day').format('YYYY-MM-DD'))
            }
          }}
          className={compact ? 'h-9 w-36 text-xs' : undefined}
          required
        />
      </div>

      <div className="space-y-2">
        {!compact && (
          <Label htmlFor="search_check_out" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Check-out
          </Label>
        )}
        <Input
          id="search_check_out"
          type="date"
          min={minCheckOut}
          value={checkOut}
          onChange={(event) => setCheckOut(event.target.value)}
          className={compact ? 'h-9 w-36 text-xs' : undefined}
          required
        />
      </div>

      <div className="space-y-2">
        {!compact && (
          <Label htmlFor="search_guests" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Khách
          </Label>
        )}
        <Input
          id="search_guests"
          type="number"
          min="1"
          value={guests}
          onChange={(event) => setGuests(Math.max(1, Number(event.target.value)))}
          className={compact ? 'h-9 w-20 text-xs' : undefined}
          required
        />
      </div>

      <Button
        type="submit"
        className={
          compact
            ? 'h-9 bg-amber-600 hover:bg-amber-700'
            : 'h-11 self-end bg-gradient-to-r from-amber-500 to-amber-700 font-semibold'
        }
      >
        <Search className="h-4 w-4" />
        {!compact && <span className="ml-2">Tìm phòng</span>}
      </Button>
    </form>
  )
}
