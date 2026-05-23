import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Search, Star, Wifi, Coffee, Car, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100" />

        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Khách sạn 5 sao tại Việt Nam
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-[1.05]">
            Đặt phòng <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">đẳng cấp</span><br />
            chưa bao giờ dễ đến thế
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Trải nghiệm dịch vụ tận tâm, tiện nghi sang trọng và hàng trăm phòng đẳng cấp đang chờ bạn khám phá.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/rooms">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold h-12 px-8 shadow-lg shadow-amber-500/30"
              >
                <Search className="w-5 h-5 mr-2" />
                Khám phá phòng
              </Button>
            </Link>
            <Link href="/search">
              <Button
                size="lg"
                variant="outline"
                className="font-semibold h-12 px-8 border-amber-300 hover:bg-amber-50"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Tìm phòng theo ngày
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Search Card */}
      <section className="max-w-5xl mx-auto px-4 -mt-20 relative z-20">
        <Card className="shadow-2xl border-amber-200/50 bg-white/95 backdrop-blur-md">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4">Tìm kiếm nhanh</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">📅 Check-in</label>
                <input
                  type="date"
                  className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">📅 Check-out</label>
                <input
                  type="date"
                  className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">👥 Số khách</label>
                <input
                  type="number"
                  min="1"
                  defaultValue="2"
                  className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
            </div>
            <Link href="/search">
              <Button className="w-full mt-4 h-12 bg-gradient-to-r from-amber-500 to-amber-700 font-semibold">
                <Search className="w-4 h-4 mr-2" />
                Tìm phòng còn trống
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black tracking-tight mb-4">Tại sao chọn HBMS?</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm hoàn hảo cho mỗi chuyến đi của bạn.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Wifi, label: 'Wi-Fi miễn phí', desc: 'Tốc độ cao mọi nơi' },
            { icon: Coffee, label: 'Bữa sáng buffet', desc: 'Đa dạng món ăn' },
            { icon: Car, label: 'Đưa đón sân bay', desc: 'Xe sang trọng' },
            { icon: Star, label: 'Dịch vụ 5 sao', desc: 'Tận tâm 24/7' },
          ].map((f) => (
            <Card key={f.label} className="text-center hover:shadow-xl hover:-translate-y-1 transition-all border-amber-100">
              <CardContent className="pt-8 pb-6 px-4">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <f.icon className="w-7 h-7 text-amber-700" />
                </div>
                <h3 className="font-bold text-lg mb-1">{f.label}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 p-12 text-center text-white shadow-2xl">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-4xl font-black mb-3">Sẵn sàng cho kỳ nghỉ?</h2>
          <p className="text-amber-50 mb-6 max-w-xl mx-auto">
            Đặt phòng ngay hôm nay và nhận ưu đãi đặc biệt cho khách hàng mới!
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 font-bold h-12 px-8 shadow-xl">
              Đăng ký ngay
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
