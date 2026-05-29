import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import ThemeProvider from '@/components/theme-provider'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'HBMS Hotel - Đặt phòng khách sạn dễ dàng',
    template: '%s | HBMS Hotel',
  },
  description:
    'Hệ thống quản lý đặt phòng khách sạn HBMS. Đặt phòng nhanh chóng, an toàn với nhiều tiện ích cao cấp.',
  keywords: ['hotel booking', 'HBMS Hotel', 'đặt phòng khách sạn', 'Next.js', 'Supabase'],
  authors: [{ name: 'HBMS Hotel' }],
  openGraph: {
    title: 'HBMS Hotel - Đặt phòng khách sạn dễ dàng',
    description: 'Tìm phòng, đặt phòng và quản lý lưu trú trên hệ thống HBMS Hotel.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'HBMS Hotel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HBMS Hotel',
    description: 'Đặt phòng khách sạn nhanh chóng và an toàn.',
  },
  robots: {
    index: true,
    follow: true,
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}

