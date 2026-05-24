import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import PrintButton from '@/components/bookings/print-button'
import type { BookingStatus, PaymentStatus } from '@/types/database'

type Params = Promise<{ roomId: string }>

type BookingPrint = {
  booking_code: string
  check_in_date: string
  check_out_date: string
  total_guests: number
  total_price: number
  status: BookingStatus
  payment_status: PaymentStatus
  special_requests: string | null
  customer: {
    full_name: string | null
    phone: string | null
    address: string | null
  } | null
  room: {
    room_number: string
    room_type: {
      name: string
      base_price: number
    } | null
  } | null
}

export default async function BookingPrintPage({ params }: { params: Params }) {
  const { roomId: bookingId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let query = supabase
    .from('bookings')
    .select(
      `booking_code, check_in_date, check_out_date, total_guests, total_price, status, payment_status, special_requests,
      customer:profiles(full_name, phone, address),
      room:rooms(room_number, room_type:room_types(name, base_price))`
    )
    .eq('id', bookingId)

  if (profile?.role !== 'admin') {
    query = query.eq('customer_id', user.id)
  }

  const { data } = await query.single()
  const booking = data as unknown as BookingPrint | null
  if (!booking) redirect('/my-bookings')

  return (
    <main className="mx-auto max-w-3xl bg-white p-8 text-gray-950 print:p-0">
      <style>{`
        @media print {
          body { background: white; }
          .no-print { display: none; }
          main { max-width: none; }
        }
      `}</style>

      <div className="no-print mb-6 flex justify-end">
        <PrintButton />
      </div>

      <header className="border-b-2 border-gray-900 pb-6">
        <p className="text-sm font-bold uppercase tracking-[0.3em]">HBMS Hotel</p>
        <h1 className="mt-2 text-3xl font-black">Phiếu xác nhận đặt phòng</h1>
        <p className="mt-1 font-mono text-lg">{booking.booking_code}</p>
      </header>

      <section className="grid grid-cols-2 gap-8 border-b border-gray-300 py-6">
        <div>
          <h2 className="mb-3 text-sm font-black uppercase">Khách hàng</h2>
          <p className="font-bold">{booking.customer?.full_name || 'Khách'}</p>
          <p>{booking.customer?.phone || '-'}</p>
          <p>{booking.customer?.address || '-'}</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-black uppercase">Thông tin phòng</h2>
          <p className="font-bold">Phòng {booking.room?.room_number || '-'}</p>
          <p>{booking.room?.room_type?.name || '-'}</p>
          <p>{formatCurrency(Number(booking.room?.room_type?.base_price || 0))}/đêm</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-8 border-b border-gray-300 py-6">
        <Line label="Check-in" value={formatDate(booking.check_in_date)} />
        <Line label="Check-out" value={formatDate(booking.check_out_date)} />
        <Line label="Số khách" value={`${booking.total_guests} khách`} />
        <Line label="Trạng thái" value={booking.status} />
      </section>

      {booking.special_requests && (
        <section className="border-b border-gray-300 py-6">
          <h2 className="mb-2 text-sm font-black uppercase">Yêu cầu đặc biệt</h2>
          <p>{booking.special_requests}</p>
        </section>
      )}

      <section className="py-6 text-right">
        <p className="text-sm font-bold uppercase tracking-wider">Tổng thanh toán</p>
        <p className="text-3xl font-black">{formatCurrency(Number(booking.total_price))}</p>
      </section>

      <footer className="mt-12 grid grid-cols-2 gap-8 text-center">
        <div>
          <div className="mb-16 border-t border-gray-400" />
          <p className="font-bold">Khách hàng</p>
        </div>
        <div>
          <div className="mb-16 border-t border-gray-400" />
          <p className="font-bold">Khách sạn</p>
        </div>
      </footer>
    </main>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  )
}
