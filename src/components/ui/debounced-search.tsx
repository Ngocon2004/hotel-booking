'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Props = {
  basePath: string
  placeholder: string
  defaultValue?: string
  searchParams?: Record<string, string | undefined>
  delay?: number
}

export default function DebouncedSearch({
  basePath,
  placeholder,
  defaultValue = '',
  searchParams = {},
  delay = 400,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [value, setValue] = useState(defaultValue)
  const fixedParamsKey = JSON.stringify(searchParams)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams()
      const fixedSearchParams = JSON.parse(fixedParamsKey) as Record<string, string | undefined>
      Object.entries(fixedSearchParams).forEach(([key, item]) => {
        if (item) params.set(key, item)
      })
      if (value.trim()) params.set('q', value.trim())
      else params.delete('q')

      startTransition(() => {
        const query = params.toString()
        const nextUrl = `${basePath}${query ? `?${query}` : ''}`
        const currentQuery = currentSearchParams.toString()
        const currentUrl = `${pathname}${currentQuery ? `?${currentQuery}` : ''}`

        if (nextUrl !== currentUrl) {
          router.push(nextUrl)
        }
      })
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [basePath, currentSearchParams, delay, fixedParamsKey, pathname, router, value])

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  )
}
