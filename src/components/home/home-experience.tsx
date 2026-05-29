'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  Languages,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Waves,
} from 'lucide-react'
import SearchForm from '@/components/booking/search-form'
import ThemeToggle from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

type Lang = 'vi' | 'en'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const slides = [
  {
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85',
    vi: 'Không gian nghỉ dưỡng ven biển',
    en: 'Coastal resort stay',
  },
  {
    src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1800&q=85',
    vi: 'Sảnh khách sạn hiện đại',
    en: 'Modern hotel lobby',
  },
  {
    src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1800&q=85',
    vi: 'Phòng suite cao cấp',
    en: 'Premium suite room',
  },
]

const copy = {
  vi: {
    eyebrow: 'HBMS Hotel',
    headline: 'Đặt phòng khách sạn rõ ràng, nhanh và đáng tin cậy.',
    lead:
      'Trải nghiệm lưu trú cao cấp với quy trình tìm phòng, đặt phòng và quản lý booking được tối ưu cho khách hàng hiện đại.',
    primary: 'Khám phá phòng',
    secondary: 'Tìm theo ngày',
    trusted: 'Được thiết kế cho đặt phòng an toàn và quản trị khách sạn hiệu quả.',
    searchTitle: 'Tìm kỳ nghỉ phù hợp',
    stats: [
      ['24/7', 'Hỗ trợ đặt phòng'],
      ['5 sao', 'Tiêu chuẩn dịch vụ'],
      ['Realtime', 'Cập nhật trạng thái'],
    ],
    featuresTitle: 'Trải nghiệm chuyên nghiệp từ lúc tìm phòng đến khi trả phòng',
    featuresLead:
      'HBMS tập trung vào tốc độ, tính minh bạch và khả năng quản lý vòng đời booking.',
    features: [
      ['Tìm phòng thông minh', 'Lọc theo ngày, số khách, loại phòng và giá để ra quyết định nhanh.'],
      ['Booking an toàn', 'Kiểm tra phòng trống ở tầng dữ liệu để giảm rủi ro trùng lịch.'],
      ['Quản lý rõ ràng', 'Khách hàng và quản trị viên theo dõi trạng thái booking theo thời gian thực.'],
    ],
    showcaseTitle: 'Một hệ thống đặt phòng mang cảm giác cao cấp nhưng vận hành gọn',
    showcaseLead:
      'Mỗi bước được sắp xếp rõ ràng để khách đặt phòng tự tin hơn và đội ngũ vận hành kiểm soát dữ liệu tốt hơn.',
    ctaTitle: 'Sẵn sàng đặt kỳ nghỉ tiếp theo?',
    ctaLead: 'Bắt đầu với danh sách phòng hoặc tìm nhanh theo ngày lưu trú mong muốn.',
    ctaButton: 'Xem phòng trống',
  },
  en: {
    eyebrow: 'HBMS Hotel',
    headline: 'Hotel booking that feels clear, fast, and dependable.',
    lead:
      'A polished stay experience with room discovery, booking, and reservation management built for modern travelers.',
    primary: 'Explore rooms',
    secondary: 'Search by date',
    trusted: 'Designed for secure booking and efficient hotel operations.',
    searchTitle: 'Find the right stay',
    stats: [
      ['24/7', 'Booking support'],
      ['5-star', 'Service standard'],
      ['Realtime', 'Status updates'],
    ],
    featuresTitle: 'A professional flow from room search to checkout',
    featuresLead:
      'HBMS focuses on speed, transparency, and reliable reservation lifecycle management.',
    features: [
      ['Smart room search', 'Filter by date, guests, room type, and price to decide faster.'],
      ['Safe reservations', 'Availability is checked at the data layer to reduce double-booking risk.'],
      ['Clear management', 'Guests and admins can follow booking status as it changes.'],
    ],
    showcaseTitle: 'A premium booking system that stays operationally lean',
    showcaseLead:
      'Every step is arranged clearly so guests can book with confidence and operators can control data better.',
    ctaTitle: 'Ready for your next stay?',
    ctaLead: 'Start from the room catalog or search quickly by your preferred stay dates.',
    ctaButton: 'View available rooms',
  },
}

export default function HomeExperience() {
  const [lang, setLang] = useState<Lang>('vi')
  const [activeSlide, setActiveSlide] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const heroImage = useRef<HTMLImageElement>(null)
  const t = copy[lang]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 5200)

    return () => window.clearInterval(timer)
  }, [])

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return

      gsap.fromTo(
        '[data-home-intro]',
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }
      )

      gsap.fromTo(
        '[data-home-reveal]',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: '[data-home-reveal-root]',
            start: 'top 82%',
            once: true,
          },
        }
      )
    },
    { scope: root }
  )

  useGSAP(
    () => {
      if (!heroImage.current) return
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return

      gsap.fromTo(
        heroImage.current,
        { autoAlpha: 0, scale: 1.04 },
        { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power2.out' }
      )
    },
    { dependencies: [activeSlide], scope: root }
  )

  return (
    <div ref={root} className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={heroImage}
            key={slides[activeSlide].src}
            src={slides[activeSlide].src}
            alt={slides[activeSlide][lang]}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55 dark:bg-black/68" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 lg:px-8">
          <div data-home-intro className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-full border-white/25 bg-white/12 px-3 text-white backdrop-blur hover:bg-white/20"
              onClick={() => setLang((current) => (current === 'vi' ? 'en' : 'vi'))}
            >
              <Languages className="h-4 w-4" />
              {lang === 'vi' ? 'VI' : 'EN'}
            </Button>
            <ThemeToggle />
          </div>

          <div className="grid items-end gap-8 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(440px,520px)]">
            <div className="max-w-4xl">
              <div data-home-intro className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                <Sparkles className="h-4 w-4 text-blue-300" />
                {t.eyebrow}
              </div>
              <h1 data-home-intro className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {t.headline}
              </h1>
              <p data-home-intro className="mt-6 max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">
                {t.lead}
              </p>
              <div data-home-intro className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/rooms">
                  <Button size="lg" className="h-12 bg-blue-600 px-7 font-bold text-white shadow-lg shadow-blue-950/30 hover:bg-blue-700">
                    {t.primary}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/search">
                  <Button size="lg" variant="outline" className="h-12 border-white/30 bg-white/10 px-7 font-bold text-white backdrop-blur hover:bg-white/20">
                    {t.secondary}
                  </Button>
                </Link>
              </div>
              <p data-home-intro className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-200">
                <ShieldCheck className="h-4 w-4 text-blue-300" />
                {t.trusted}
              </p>
            </div>

            <div data-home-intro className="rounded-lg border border-white/18 bg-white/92 p-5 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-slate-950/86">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-950 dark:text-white">{t.searchTitle}</h2>
                <CalendarCheck className="h-5 w-5 text-blue-600" />
              </div>
              <SearchForm lang={lang} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900 md:grid-cols-3">
          {t.stats.map(([value, label]) => (
            <div key={label} className="border-b border-slate-200 p-6 last:border-b-0 dark:border-white/10 md:border-b-0 md:border-r md:last:border-r-0">
              <p className="text-3xl font-black text-blue-600">{value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section data-home-reveal-root className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div data-home-reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">HBMS Suite</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
            {t.featuresTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{t.featuresLead}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[BedDouble, CheckCircle2, Waves].map((Icon, index) => (
            <div
              key={t.features[index][0]}
              data-home-reveal
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-slate-950 dark:text-white">{t.features[index][0]}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{t.features[index][1]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white dark:bg-black">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-300">Operational Standard</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">{t.showcaseTitle}</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">{t.showcaseLead}</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-200">
              <Star className="h-4 w-4 fill-blue-300 text-blue-300" />
              {slides[activeSlide][lang]}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slides[(activeSlide + 1) % slides.length].src}
              alt={slides[(activeSlide + 1) % slides.length][lang]}
              className="h-80 w-full rounded-lg object-cover shadow-2xl"
            />
            <div className="grid gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slides[(activeSlide + 2) % slides.length].src}
                alt={slides[(activeSlide + 2) % slides.length][lang]}
                className="h-[9.5rem] w-full rounded-lg object-cover"
              />
              <div className="rounded-lg border border-white/10 bg-white/10 p-5">
                <MapPin className="mb-4 h-6 w-6 text-blue-300" />
                <p className="text-sm leading-6 text-slate-200">
                  {lang === 'vi'
                    ? 'Trải nghiệm lưu trú được trình bày rõ ràng, từ hình ảnh phòng đến trạng thái đặt chỗ.'
                    : 'A stay experience presented clearly, from room visuals to booking status.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-slate-900 sm:p-12">
          <h2 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white">{t.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">{t.ctaLead}</p>
          <Link href="/rooms" className="mt-7 inline-flex">
            <Button size="lg" className="h-12 bg-blue-600 px-8 font-bold text-white hover:bg-blue-700">
              {t.ctaButton}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
