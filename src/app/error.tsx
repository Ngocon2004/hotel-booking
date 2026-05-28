'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="text-3xl font-black tracking-tight">Co loi xay ra</h1>
      <p className="mt-2 text-sm text-gray-500">
        Trang hien tai khong the hien thi. Hay thu tai lai hoac quay lai sau.
      </p>
      <Button className="mt-6 gap-2" onClick={reset}>
        <RefreshCcw className="h-4 w-4" />
        Thu lai
      </Button>
    </div>
  )
}
