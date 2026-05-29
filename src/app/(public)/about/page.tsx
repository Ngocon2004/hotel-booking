import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Award,
  BedDouble,
  Building2,
  CheckCircle2,
  Clock3,
  ConciergeBell,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wifi,
} from 'lucide-react'
import GsapReveal from '@/components/animations/gsap-reveal'

export const metadata: Metadata = {
  title: 'Gioi thieu',
  description:
    'Kham pha HBMS Hotel - trai nghiem dat phong khach san hien dai, dich vu tan tam va khong gian luu tru cao cap.',
}

const stats = [
  { value: '24/7', label: 'Ho tro khach luu tru' },
  { value: '4.9/5', label: 'Diem hai long trung binh' },
  { value: '120+', label: 'Phong va suite san sang' },
  { value: '8', label: 'Tieu chuan van hanh cot loi' },
]

const values = [
  {
    icon: HeartHandshake,
    title: 'Tan tam trong tung cham',
    description:
      'Moi tuong tac duoc thiet ke de khach hang cam thay duoc lang nghe, duoc ho tro va duoc chao don dung muc.',
  },
  {
    icon: ShieldCheck,
    title: 'Minh bach va an tam',
    description:
      'Thong tin phong, gia, dich vu va trang thai booking duoc cap nhat ro rang, giup quyet dinh nhanh va chinh xac.',
  },
  {
    icon: Sparkles,
    title: 'Trai nghiem co gu',
    description:
      'HBMS ket hop phong cach hien dai, quy trinh gon gang va dich vu tinh te de moi ky nghi tro nen dang nho.',
  },
]

const serviceHighlights = [
  { icon: ConciergeBell, label: 'Le tan va ho tro nhanh' },
  { icon: BedDouble, label: 'Phong nghi tien nghi' },
  { icon: Wifi, label: 'Ket noi va tien ich day du' },
  { icon: Clock3, label: 'Dat phong theo thoi gian thuc' },
]

const standards = [
  'Quy trinh booking ro rang tu tim phong den xac nhan.',
  'Trang thai phong va lich su dat cho duoc dong bo realtime.',
  'Khu quan tri giup nhan vien xu ly booking, khach hang va dich vu tap trung.',
  'Du lieu duoc bao ve bang Supabase Auth, RLS va phan quyen admin/customer.',
]

export default function AboutPage() {
  return (
    <GsapReveal className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2400&q=85"
          alt="Khong gian sanh khach san cao cap"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white dark:from-slate-950" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-end px-4 pb-14 pt-24 sm:px-6 lg:px-8">
          <div data-gsap-reveal className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
              <Award className="h-4 w-4 text-amber-300" />
              HBMS Hotel Experience
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Khach san hien dai cho nhung ky nghi co gu.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/86 sm:text-lg">
              HBMS Hotel la he thong dat phong va quan ly luu tru duoc xay dung de mang lai
              trai nghiem nhanh, ro rang va dang tin cay tu luc tim phong den khi hoan tat ky nghi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/rooms"
                className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-semibold text-slate-950 transition-colors hover:bg-blue-50"
              >
                Kham pha phong
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/search"
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/50 bg-white/10 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Tim phong phu hop
              </Link>
            </div>
          </div>

          <div data-gsap-stagger className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/18 bg-white/12 p-4 text-white backdrop-blur-md"
              >
                <div className="text-3xl font-black">{item.value}</div>
                <div className="mt-1 text-sm font-medium text-white/76">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div data-gsap-reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-500/12 dark:text-blue-200">
              <Building2 className="h-4 w-4" />
              Ve chung toi
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-normal sm:text-5xl">
              Noi cong nghe lam cho dich vu tro nen mem mai hon.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
              HBMS khong chi la mot website dat phong. Day la mot trai nghiem van hanh khach
              san tron ven: khach hang tim phong nhanh, nhan thong tin minh bach; nhan vien quan
              tri booking, phong, dich vu va danh gia trong mot he thong thong nhat.
            </p>
            <div className="mt-7 grid gap-3">
              {standards.map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div data-gsap-reveal data-gsap-delay="0.08" className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85"
              alt="Khu nghi duong voi ho boi va khach san hien dai"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/86 to-transparent p-6 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-amber-300" />
                Khong gian luu tru hien dai, van hanh bang du lieu thoi gian thuc
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900/60 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div data-gsap-reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-400/12 dark:text-amber-200">
              <Star className="h-4 w-4" />
              Gia tri khac biet
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-normal sm:text-5xl">
              Dang cap nam o cach moi chi tiet duoc cham chut.
            </h2>
          </div>

          <div data-gsap-stagger className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-slate-950"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div data-gsap-reveal className="grid gap-4 sm:grid-cols-2">
            {serviceHighlights.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
                >
                  <Icon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                  <p className="mt-5 text-lg font-black">{item.label}</p>
                </div>
              )
            })}
          </div>

          <div data-gsap-reveal data-gsap-delay="0.08">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-200">
              <Users className="h-4 w-4" />
              Danh cho khach hang va doi ngu van hanh
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-normal sm:text-5xl">
              Mot he sinh thai gon gang cho hanh trinh luu tru tron ven.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
              Tu giao dien tim phong cho khach den dashboard quan tri, HBMS dat muc tieu giam
              thao tac thua, tang toc do phuc vu va giu moi thong tin quan trong trong tam kiem soat.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/rooms"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Xem phong dang co
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/api-docs"
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Xem API docs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </GsapReveal>
  )
}
