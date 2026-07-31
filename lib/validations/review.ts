import { z } from "zod"

export const reviewSchema = z.object({
  rentalOrderId: z.string(),
  rating: z.number().int().min(1, "Please select a rating").max(5),
  comment: z.string().optional(),
})

export type ReviewInput = z.infer<typeof reviewSchema>
