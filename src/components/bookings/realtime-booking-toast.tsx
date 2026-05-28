'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function RealtimeBookingToast() {
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('admin-bookings-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        (payload) => {
          const booking = payload.new as { booking_code?: string }
          toast.info(`Booking mới: ${booking.booking_code || 'đang cập nhật'}`)
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  return null
}
