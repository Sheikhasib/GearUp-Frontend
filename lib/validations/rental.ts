import { z } from "zod"

const pad2 = (n: number) => String(n).padStart(2, "0")

export const toLocalDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`

export const toUTCDateKey = (value: string): string => new Date(value).toISOString().slice(0, 10)

export const toUTCMidnightISO = (date: Date): string => `${toLocalDateKey(date)}T00:00:00.000Z`

export function isDateInUnavailableRange(
  date: Date,
  ranges: { startDate: string; endDate: string }[]
): boolean {
  if (!ranges.length) return false
  const day = toLocalDateKey(date)
  return ranges.some((range) => {
    const start = toUTCDateKey(range.startDate)
    const end = toUTCDateKey(range.endDate)
    return day >= start && day < end
  })
}

export function areDateRangesOverlapping(
  requested: { startDate: string; endDate: string },
  existing: { startDate: string; endDate: string }[]
): boolean {
  if (!existing.length) return false
  const reqStart = toUTCDateKey(requested.startDate)
  const reqEnd = toUTCDateKey(requested.endDate)
  return existing.some((range) => {
    const exStart = toUTCDateKey(range.startDate)
    const exEnd = toUTCDateKey(range.endDate)
    return exStart < reqEnd && exEnd > reqStart
  })
}

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
    return toUTCDateKey(data.startDate) >= toLocalDateKey(today)
  }, {
    message: "Start date must be today or later",
    path: ["startDate"],
  })

export type RentNowInput = z.infer<typeof rentNowSchema>
