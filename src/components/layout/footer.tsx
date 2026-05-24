import Link from 'next/link'
import { Hotel, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 text-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black">
              HBMS<span className="text-amber-400"> Hotel</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed max-w-md">
            Hệ thống quản lý đặt phòng khách sạn hàng đầu, mang đến trải nghiệm đặt phòng nhanh chóng và an toàn cho khách hàng.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <h3 className="font-bold text-amber-400">Khám phá</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-amber-300 transition-colors">Trang chủ</Link></li>
            <li><Link href="/rooms" className="hover:text-amber-300 transition-colors">Phòng & Suite</Link></li>
            <li><Link href="/search" className="hover:text-amber-300 transition-colors">Tìm phòng</Link></li>
            <li><Link href="/about" className="hover:text-amber-300 transition-colors">Về chúng tôi</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="font-bold text-amber-400">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>123 Đường Lê Lợi, Q1, TP.HCM</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>(+84) 123 456 789</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>contact@hbms.vn</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} HBMS Hotel. Đồ án thi cuối kỳ — Các công nghệ mới trong phát triển phần mềm.
        </div>
      </div>
    </footer>
  )
}
