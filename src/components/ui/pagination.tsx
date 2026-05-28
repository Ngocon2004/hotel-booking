import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  page: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string | undefined>
}

function hrefFor(basePath: string, searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams()
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  if (page > 1) params.set('page', String(page))
  else params.delete('page')
  const query = params.toString()
  return `${basePath}${query ? `?${query}` : ''}`
}

export default function Pagination({ page, totalPages, basePath, searchParams = {} }: Props) {
  if (totalPages <= 1) return null

  const previous = Math.max(1, page - 1)
  const next = Math.min(totalPages, page + 1)
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (item) => item === 1 || item === totalPages || Math.abs(item - page) <= 1
  )

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Pagination">
      <p className="text-sm text-gray-500">
        Trang <strong>{page}</strong> / {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <Link href={hrefFor(basePath, searchParams, previous)} aria-disabled={page === 1}>
          <Button variant="outline" size="sm" disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        {pages.map((item, index) => {
          const previousItem = pages[index - 1]
          const showGap = previousItem && item - previousItem > 1
          return (
            <div key={item} className="flex items-center gap-1">
              {showGap && <span className="px-2 text-sm text-gray-400">...</span>}
              <Link href={hrefFor(basePath, searchParams, item)}>
                <Button
                  variant={item === page ? 'default' : 'outline'}
                  size="sm"
                  className={item === page ? 'bg-amber-600 text-white hover:bg-amber-700' : ''}
                >
                  {item}
                </Button>
              </Link>
            </div>
          )
        })}
        <Link href={hrefFor(basePath, searchParams, next)} aria-disabled={page === totalPages}>
          <Button variant="outline" size="sm" disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </nav>
  )
}
