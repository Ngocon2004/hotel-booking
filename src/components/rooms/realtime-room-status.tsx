'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { RoomStatus } from '@/types/database'

type Props = {
  roomId: string
  initialStatus: RoomStatus
  showBadge?: boolean
}

export default function RealtimeRoomStatus({ roomId, initialStatus, showBadge = true }: Props) {
  const [status, setStatus] = useState(initialStatus)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`room-status-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const nextStatus = (payload.new as { status?: RoomStatus }).status
          if (!nextStatus) return
          setStatus(nextStatus)
          toast.info(
            nextStatus === 'available'
              ? 'Phòng vừa sẵn sàng trở lại'
              : 'Phòng vừa được chuyển sang bảo trì'
          )
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [roomId])

  if (!showBadge) return null

  return (
    <Badge
      className={
        status === 'available'
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-rose-100 text-rose-700'
      }
    >
      {status === 'available' ? 'Sẵn sàng' : 'Bảo trì'}
    </Badge>
  )
}
