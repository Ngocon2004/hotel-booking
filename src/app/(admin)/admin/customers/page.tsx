import Link from 'next/link'
import { Search, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SearchParams = Promise<{ q?: string }>

type CustomerRow = {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  created_at: string
  bookings: { id: string; total_price: number }[]
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, phone, address, created_at, bookings(id, total_price)')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  let customers = (data || []) as unknown as CustomerRow[]

  if (params.q) {
    const q = params.q.toLowerCase()
    customers = customers.filter(
      (customer) =>
        customer.full_name?.toLowerCase().includes(q) ||
        customer.phone?.toLowerCase().includes(q) ||
        customer.address?.toLowerCase().includes(q)
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
          <Users className="h-3 w-3" />
          Customers
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Quản lý khách hàng</h1>
        <p className="mt-1 text-sm text-gray-500">Tra cứu hồ sơ và lịch sử đặt phòng của khách.</p>
      </div>

      <Card className="border-amber-100">
        <CardContent className="p-5">
          <form action="/admin/customers" className="flex gap-2">
            <Input name="q" defaultValue={params.q || ''} placeholder="Tìm tên, SĐT, địa chỉ..." />
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              <Search className="mr-2 h-4 w-4" />
              Tìm
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border border-amber-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-amber-50 text-left text-xs uppercase tracking-wider text-amber-900">
            <tr>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Địa chỉ</th>
              <th className="px-4 py-3 text-right">Số booking</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-amber-50">
                <td className="px-4 py-3 font-bold">{customer.full_name || 'Khách'}</td>
                <td className="px-4 py-3">{customer.phone || '-'}</td>
                <td className="px-4 py-3 text-gray-500">{customer.address || '-'}</td>
                <td className="px-4 py-3 text-right font-semibold">{customer.bookings?.length || 0}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/customers/${customer.id}`}>
                    <Button variant="outline" size="sm">
                      Chi tiết
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  Không có khách hàng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
