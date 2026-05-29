'use client'

import { useActionState, useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createReview } from '@/server/actions/reviews'

type Props = {
  bookingId: string
}

export default function ReviewForm({ bookingId }: Props) {
  const [state, formAction, pending] = useActionState(createReview, undefined)
  const [rating, setRating] = useState(5)

  if (state?.success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
        {state.message || 'Cảm ơn bạn đã đánh giá'}
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="booking_id" value={bookingId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="space-y-2">
        <Label>Đánh giá của bạn</Label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1
            const active = value <= rating
            return (
              <button
                key={value}
                type="button"
                aria-label={`${value} sao`}
                className="rounded-md p-1 outline-none transition hover:bg-amber-50 focus-visible:ring-3 focus-visible:ring-amber-300"
                onClick={() => setRating(value)}
              >
                <Star
                  className={`h-7 w-7 ${
                    active ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                  }`}
                />
              </button>
            )
          })}
        </div>
        {state?.errors?.rating && (
          <p className="text-sm text-red-600">{state.errors.rating[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Bình luận</Label>
        <Textarea
          id="comment"
          name="comment"
          rows={4}
          placeholder="Chia sẻ trải nghiệm lưu trú của bạn..."
        />
        {state?.errors?.comment && (
          <p className="text-sm text-red-600">{state.errors.comment[0]}</p>
        )}
      </div>

      {state?.errors?._form && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.errors._form[0]}
        </div>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="bg-gradient-to-r from-amber-500 to-amber-700 font-semibold hover:from-amber-600 hover:to-amber-800"
      >
        {pending ? 'Đang gửi...' : 'Gửi đánh giá'}
      </Button>
    </form>
  )
}
