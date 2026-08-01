import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const rentalDayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

// Rental endDate is stored as exclusive (next-day midnight); show the last day.
export const formatRentalDay = (value: string) =>
  rentalDayFormatter.format(new Date(value))

export const formatRentalEndDate = (value: string) =>
  rentalDayFormatter.format(new Date(new Date(value).getTime() - 86400000))

export const formatRentalPeriod = (startDate: string, endDate: string) =>
  `${formatRentalDay(startDate)} – ${formatRentalEndDate(endDate)}`
