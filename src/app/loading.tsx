import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-white px-4 py-3 text-sm font-semibold text-amber-800 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Đang tải...
      </div>
    </div>
  )
}
