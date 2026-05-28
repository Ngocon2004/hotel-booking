import Link from 'next/link'
import { Star, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { deleteReview } from '@/server/actions/reviews'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils/format'
import Pagination from '@/components/ui/pagination'

type ReviewRow = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  customer: {
    full_name: string | null
    phone: string | null
  } | null
  booking: {
    id: string
    booking_code: string
    room: {
      id: string
      room_number: string
      room_type: {
        name: string
      } | null
    } | null
  } | null
}

type SearchParams = Promise<{ page?: string }>

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const currentPage = Math.max(1, Number(params.page || 1))
  const pageSize = 10
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select(
      `id, rating, comment, created_at,
      customer:profiles(full_name, phone),
      booking:bookings(id, booking_code, room:rooms(id, room_number, room_type:room_types(name)))`
    )
    .order('created_at', { ascending: false })

  const reviews = (data || []) as unknown as ReviewRow[]
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0
  const totalPages = Math.max(1, Math.ceil(reviews.length / pageSize))
  const page = Math.min(currentPage, totalPages)
  const pagedReviews = reviews.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Quan ly danh gia</h1>
        <p className="mt-1 text-sm text-gray-500">
          Theo doi va xoa cac danh gia khong phu hop.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-500">Tong danh gia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{reviews.length}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-500">Diem trung binh</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">{avgRating.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-500">Danh gia 5 sao</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">
              {reviews.filter((review) => review.rating === 5).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-amber-100">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khach hang</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Phong</TableHead>
                <TableHead>Danh gia</TableHead>
                <TableHead>Noi dung</TableHead>
                <TableHead>Ngay tao</TableHead>
                <TableHead className="text-right">Thao tac</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedReviews.length > 0 ? (
                pagedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{review.customer?.full_name || 'Khach'}</p>
                        <p className="text-xs text-gray-500">{review.customer?.phone || '-'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {review.booking ? (
                        <Link
                          href={`/admin/bookings/${review.booking.id}`}
                          className="font-semibold text-amber-700 hover:underline"
                        >
                          {review.booking.booking_code}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {review.booking?.room ? (
                        <div>
                          <p className="font-semibold">Phong {review.booking.room.room_number}</p>
                          <p className="text-xs text-gray-500">
                            {review.booking.room.room_type?.name || '-'}
                          </p>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="gap-1 bg-amber-100 text-amber-800">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {review.rating}/5
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-sm whitespace-normal">
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {review.comment || '-'}
                      </p>
                    </TableCell>
                    <TableCell>{formatDate(review.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <form action={deleteReview.bind(null, review.id)}>
                        <Button
                          type="submit"
                          variant="destructive"
                          size="sm"
                          aria-label="Xoa danh gia"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                    Chua co danh gia nao
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Pagination page={page} totalPages={totalPages} basePath="/admin/reviews" />
    </div>
  )
}
