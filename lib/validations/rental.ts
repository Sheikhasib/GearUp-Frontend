import { z } from "zod"

export const rentNowSchema = z
  .object({
    gearItemId: z.string().min(1, "Gear is required"),
    startDate: z.string().datetime("Start date is required"),
    endDate: z.string().datetime("End date is required"),
    quantity: z
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1"),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Start date must be on or before end date",
    path: ["endDate"],
  })
  .refine((data) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(data.startDate) >= today
  }, {
    message: "Start date must be today or later",
    path: ["startDate"],
  })

export type RentNowInput = z.infer<typeof rentNowSchema>
