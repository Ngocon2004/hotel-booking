import Link from 'next/link'
import { ArrowLeft, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
        <SearchX className="h-6 w-6" />
      </div>
      <h1 className="text-3xl font-black tracking-tight">Không tìm thấy trang</h1>
      <p className="mt-2 text-sm text-gray-500">
        Đường dẫn này không tồn tại hoặc nội dung đã được di chuyển.
      </p>
      <Link href="/">
        <Button className="mt-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Về trang chủ
        </Button>
      </Link>
    </div>
  )
}
