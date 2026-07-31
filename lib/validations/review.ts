import { z } from "zod"

export const reviewSchema = z.object({
  rentalOrderId: z.string().min(1, "Rental order is required"),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Please select a rating")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().optional(),
})

export type ReviewInput = z.infer<typeof reviewSchema>
