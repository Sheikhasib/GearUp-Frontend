"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import { Star } from "@phosphor-icons/react"
import { reviewSchema, type ReviewInput } from "@/lib/validations/review"
import { createReviewAction } from "../../_actions/reviewActions"
import { Button } from "@/components/ui/button"

interface ReviewFormProps {
  rentalOrderId: string
  gearItemName: string
  onSuccess: () => void
}

export function ReviewForm({ rentalOrderId, gearItemName, onSuccess }: ReviewFormProps) {
  const [hovered, setHovered] = useState(0)
  const [pending, setPending] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rentalOrderId, rating: 0, comment: "" },
  })

  const rating = useWatch({ control, name: "rating" })

  const onSubmit = async (data: ReviewInput) => {
    setPending(true)
    try {
      const result = await createReviewAction(data)
      if (result.success) {
        toast.success(result.message)
        onSuccess()
      } else {
        toast.error(result.message)
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <p className="mb-1 text-sm text-muted-foreground">
          How was your experience with{" "}
          <span className="font-medium text-foreground">{gearItemName}</span>?
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
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              onClick={() => setValue("rating", star, { shouldValidate: true })}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="p-1 text-2xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Star
                weight={star <= (hovered || rating) ? "fill" : "regular"}
                className={
                  star <= (hovered || rating)
                    ? "text-accent-solid"
                    : "text-muted-foreground/30"
                }
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-xs text-destructive">{errors.rating.message}</p>
        )}
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

      <Button
        type="submit"
        disabled={pending || rating === 0}
        className="w-full cursor-pointer"
      >
        {pending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
