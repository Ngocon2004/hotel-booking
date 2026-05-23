import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
})

export const metadata: Metadata = {
  title: 'HBMS Hotel - Đặt phòng khách sạn dễ dàng',
  description:
    'Hệ thống quản lý đặt phòng khách sạn HBMS. Đặt phòng nhanh chóng, an toàn với nhiều tiện ích đẳng cấp.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-white text-gray-900 font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
