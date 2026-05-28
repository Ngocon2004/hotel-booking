'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function RealtimeRoomsToast() {
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('admin-rooms-status-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms' },
        (payload) => {
          const room = payload.new as { room_number?: string; status?: string }
          toast.info(`Phòng ${room.room_number || ''} cập nhật: ${room.status || 'unknown'}`)
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  return null
}
