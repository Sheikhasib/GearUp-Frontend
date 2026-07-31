"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { reviewSchema, type ReviewInput } from "@/lib/validations/review"
import { createReviewAction } from "../../_actions/reviewActions"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"

interface ReviewFormProps {
  rentalOrderId: string
  gearItemName: string
  onSuccess: () => void
}

export function ReviewForm({ rentalOrderId, gearItemName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [pending, setPending] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rentalOrderId,
      rating: 0,
      comment: "",
    },
  })

  const onSubmit = async (data: ReviewInput) => {
    setPending(true)
    const result = await createReviewAction(data)
    setPending(false)

    if (result.success) {
      toast.success(result.message)
      onSuccess()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          How was your experience with <span className="font-medium text-foreground">{gearItemName}</span>?
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Rating
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                setRating(star)
                setValue("rating", star, { shouldValidate: true })
              }}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-2xl transition-colors cursor-pointer"
            >
              <span
                className={
                  star <= (hovered || rating)
                    ? "text-amber-400"
                    : "text-muted-foreground/30"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-xs text-red-500">{errors.rating.message}</p>
        )}
        <input type="hidden" {...register("rating", { valueAsNumber: true })} />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Comment (optional)
        </p>
        <textarea
          {...register("comment")}
          rows={4}
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 focus:ring-1 focus:ring-primary"
          placeholder="Share your experience..."
        />
      </div>

      <Button type="submit" disabled={pending || rating === 0} className="w-full cursor-pointer">
        {pending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
