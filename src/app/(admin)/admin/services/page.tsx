import Link from 'next/link'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { deleteService } from '@/server/actions/services'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils/format'
import type { Service } from '@/types/database'

export default async function AdminServicesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('services').select('*').order('created_at', {
    ascending: false,
  })

  const services = (data || []) as Service[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dich vu</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quan ly dich vu di kem khi khach dat phong.
          </p>
        </div>
        <Link href="/admin/services/new">
          <Button className="bg-gradient-to-r from-amber-500 to-amber-700 font-semibold hover:from-amber-600 hover:to-amber-800">
            <Plus className="mr-1 h-4 w-4" />
            Them dich vu
          </Button>
        </Link>
      </div>

      <Card className="border-amber-100">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50/50 hover:bg-amber-50/50">
                <TableHead>Ten dich vu</TableHead>
                <TableHead>Gia</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Trang thai</TableHead>
                <TableHead>Mo ta</TableHead>
                <TableHead className="text-right">Thao tac</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length > 0 ? (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-semibold">{service.name}</TableCell>
                    <TableCell className="font-bold text-amber-700">
                      {formatCurrency(service.price)}
                    </TableCell>
                    <TableCell>{service.icon || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          service.is_active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }
                      >
                        {service.is_active ? 'Dang bat' : 'Da tat'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-sm whitespace-normal">
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {service.description || '-'}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/services/${service.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <form action={deleteService.bind(null, service.id)}>
                          <Button
                            type="submit"
                            size="sm"
                            variant="destructive"
                            aria-label="Xoa dich vu"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                    Chua co dich vu nao
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
