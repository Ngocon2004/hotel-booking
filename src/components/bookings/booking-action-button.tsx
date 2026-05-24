'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type ActionResult = Promise<{ success?: boolean; error?: string } | undefined>

type Props = {
  action: () => ActionResult
  label: string
  pendingLabel?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  className?: string
}

export default function BookingActionButton({
  action,
  label,
  pendingLabel = 'Đang xử lý...',
  variant = 'default',
  className,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant={variant}
      disabled={isPending}
      className={className}
      onClick={() => {
        startTransition(async () => {
          const result = await action()
          if (result?.error) {
            toast.error(result.error)
            return
          }
          toast.success('Cập nhật thành công')
          router.refresh()
        })
      }}
    >
      {isPending ? pendingLabel : label}
    </Button>
  )
}
