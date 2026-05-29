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
  title: 'Giới thiệu',
  description:
    'Khám phá HBMS Hotel - trải nghiệm đặt phòng khách sạn hiện đại, dịch vụ tận tâm và không gian lưu trú cao cấp.',
}

const stats = [
  { value: '24/7', label: 'Hỗ trợ khách lưu trú' },
  { value: '4.9/5', label: 'Điểm hài lòng trung bình' },
  { value: '120+', label: 'Phòng và suite sẵn sàng' },
  { value: '8', label: 'Tiêu chuẩn vận hành cốt lõi' },
]

const values = [
  {
    icon: HeartHandshake,
    title: 'Tận tâm trong từng chạm',
    description:
      'Mỗi tương tác được thiết kế để khách hàng cảm thấy được lắng nghe, được hỗ trợ và được chào đón đúng mực.',
  },
  {
    icon: ShieldCheck,
    title: 'Minh bạch và an tâm',
    description:
      'Thông tin phòng, giá, dịch vụ và trạng thái booking được cập nhật rõ ràng, giúp quyết định nhanh và chính xác.',
  },
  {
    icon: Sparkles,
    title: 'Trải nghiệm có gu',
    description:
      'HBMS kết hợp phong cách hiện đại, quy trình gọn gàng và dịch vụ tinh tế để mỗi kỳ nghỉ trở nên đáng nhớ.',
  },
]

const serviceHighlights = [
  { icon: ConciergeBell, label: 'Lễ tân và hỗ trợ nhanh' },
  { icon: BedDouble, label: 'Phòng nghỉ tiện nghi' },
  { icon: Wifi, label: 'Kết nối và tiện ích đầy đủ' },
  { icon: Clock3, label: 'Đặt phòng theo thời gian thực' },
]

const standards = [
  'Quy trình booking rõ ràng từ tìm phòng đến xác nhận.',
  'Trạng thái phòng và lịch sử đặt chỗ được đồng bộ realtime.',
  'Khu quản trị giúp nhân viên xử lý booking, khách hàng và dịch vụ tập trung.',
  'Dữ liệu được bảo vệ bằng Supabase Auth, RLS và phân quyền admin/customer.',
]

export default function AboutPage() {
  return (
    <GsapReveal className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2400&q=85"
          alt="Không gian sảnh khách sạn cao cấp"
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
              Khách sạn hiện đại cho những kỳ nghỉ có gu.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/86 sm:text-lg">
              HBMS Hotel là hệ thống đặt phòng và quản lý lưu trú được xây dựng để mang lại
              trải nghiệm nhanh, rõ ràng và đáng tin cậy từ lúc tìm phòng đến khi hoàn tất kỳ nghỉ.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/rooms"
                className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 text-sm font-semibold text-slate-950 transition-colors hover:bg-blue-50"
              >
                Khám phá phòng
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/search"
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/50 bg-white/10 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Tìm phòng phù hợp
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
              Về chúng tôi
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-normal sm:text-5xl">
              Nơi công nghệ làm cho dịch vụ trở nên mềm mại hơn.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
              HBMS không chỉ là một website đặt phòng. Đây là một trải nghiệm vận hành khách
              sạn trọn vẹn: khách hàng tìm phòng nhanh, nhận thông tin minh bạch; nhân viên quản
              trị booking, phòng, dịch vụ và đánh giá trong một hệ thống thống nhất.
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
              alt="Khu nghỉ dưỡng với hồ bơi và khách sạn hiện đại"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/86 to-transparent p-6 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-amber-300" />
                Không gian lưu trú hiện đại, vận hành bằng dữ liệu thời gian thực
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
              Giá trị khác biệt
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-normal sm:text-5xl">
              Đẳng cấp nằm ở cách mỗi chi tiết được chăm chút.
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
              Dành cho khách hàng và đội ngũ vận hành
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-normal sm:text-5xl">
              Một hệ sinh thái gọn gàng cho hành trình lưu trú trọn vẹn.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300">
              Từ giao diện tìm phòng cho khách đến dashboard quản trị, HBMS đặt mục tiêu giảm
              thao tác thừa, tăng tốc độ phục vụ và giữ mọi thông tin quan trọng trong tầm kiểm soát.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/rooms"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Xem phòng đang có
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
