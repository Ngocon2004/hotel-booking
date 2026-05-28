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
    default: 'HBMS Hotel - Dat phong khach san de dang',
    template: '%s | HBMS Hotel',
  },
  description:
    'He thong quan ly dat phong khach san HBMS. Dat phong nhanh chong, an toan voi nhieu tien ich cao cap.',
  keywords: ['hotel booking', 'HBMS Hotel', 'dat phong khach san', 'Next.js', 'Supabase'],
  authors: [{ name: 'HBMS Hotel' }],
  openGraph: {
    title: 'HBMS Hotel - Dat phong khach san de dang',
    description: 'Tim phong, dat phong va quan ly luu tru tren he thong HBMS Hotel.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'HBMS Hotel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HBMS Hotel',
    description: 'Dat phong khach san nhanh chong va an toan.',
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

