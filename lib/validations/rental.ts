import { z } from "zod"

export const rentNowSchema = z
  .object({
    gearItemId: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    quantity: z.number().int().min(1),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "Start date must be before end date",
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
