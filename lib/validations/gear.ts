import { z } from "zod"

export const gearSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  brand: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  priceRatePerDay: z.number().positive("Price must be greater than 0"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  isAvailable: z.boolean().optional(),
})

export type GearInput = z.infer<typeof gearSchema>
