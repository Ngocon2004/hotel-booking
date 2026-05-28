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
      className={
        compact
          ? 'flex items-end gap-2 text-slate-900 dark:text-white'
          : 'grid gap-4 text-slate-900 dark:text-white sm:grid-cols-2 xl:grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)_110px_122px]'
      }
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
          className={
            compact
              ? 'h-9 w-36 bg-white text-xs text-slate-950 [color-scheme:light] dark:bg-white/10 dark:text-white dark:[color-scheme:dark]'
              : 'h-11 bg-white text-slate-950 [color-scheme:light] dark:bg-white/10 dark:text-white dark:[color-scheme:dark]'
          }
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
          className={
            compact
              ? 'h-9 w-36 bg-white text-xs text-slate-950 [color-scheme:light] dark:bg-white/10 dark:text-white dark:[color-scheme:dark]'
              : 'h-11 bg-white text-slate-950 [color-scheme:light] dark:bg-white/10 dark:text-white dark:[color-scheme:dark]'
          }
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
          className={
            compact
              ? 'h-9 w-20 bg-white text-xs text-slate-950 [color-scheme:light] dark:bg-white/10 dark:text-white dark:[color-scheme:dark]'
              : 'h-11 bg-white text-slate-950 [color-scheme:light] dark:bg-white/10 dark:text-white dark:[color-scheme:dark]'
          }
          required
        />
      </div>

      <Button
        type="submit"
        className={
          compact
            ? 'h-9 bg-blue-600 hover:bg-blue-700'
            : 'h-11 w-full self-end bg-blue-600 font-semibold hover:bg-blue-700 sm:col-span-2 xl:col-span-1'
        }
      >
        <Search className="h-4 w-4" />
        {!compact && <span className="ml-2">Tìm phòng</span>}
      </Button>
    </form>
  )
}
