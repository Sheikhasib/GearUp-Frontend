import { describe, it, expect } from "vitest"
import {
  areDateRangesOverlapping,
  getMinAvailableQuantity,
  isDateInUnavailableRange,
  toLocalDateKey,
  rentNowSchema,
} from "@/lib/validations/rental"

const dayInMs = 24 * 60 * 60 * 1000
const today = new Date()
const tomorrow = new Date(today.getTime() + dayInMs)
const inTwoDays = new Date(today.getTime() + 2 * dayInMs)
const inThreeDays = new Date(today.getTime() + 3 * dayInMs)

describe("areDateRangesOverlapping", () => {
  it("returns false for an empty list of existing ranges", () => {
    expect(areDateRangesOverlapping({ startDate: "2026-08-01", endDate: "2026-08-05" }, [])).toBe(false)
  })

  it("returns true when a requested range overlaps an existing one", () => {
    const requested = { startDate: "2026-08-03", endDate: "2026-08-07" }
    const existing = [{ startDate: "2026-08-01", endDate: "2026-08-05" }]
    expect(areDateRangesOverlapping(requested, existing)).toBe(true)
  })

  it("returns false when ranges are disjoint", () => {
    const requested = { startDate: "2026-08-10", endDate: "2026-08-15" }
    const existing = [{ startDate: "2026-08-01", endDate: "2026-08-05" }]
    expect(areDateRangesOverlapping(requested, existing)).toBe(false)
  })

  it("treats ranges as half-open: touching end-to-start does not overlap", () => {
    const requested = { startDate: "2026-08-05", endDate: "2026-08-10" }
    const existing = [{ startDate: "2026-08-01", endDate: "2026-08-05" }]
    expect(areDateRangesOverlapping(requested, existing)).toBe(false)
  })
})

describe("isDateInUnavailableRange", () => {
  const ranges = [{ startDate: "2026-08-01", endDate: "2026-08-08" }]

  it("returns false when there are no ranges", () => {
    expect(isDateInUnavailableRange(today, [])).toBe(false)
  })

  it("returns true for a date inside an unavailable range", () => {
    expect(isDateInUnavailableRange(new Date("2026-08-04"), ranges)).toBe(true)
  })

  it("excludes the range end date (half-open interval)", () => {
    expect(isDateInUnavailableRange(new Date("2026-08-08"), ranges)).toBe(false)
  })
})

describe("getMinAvailableQuantity", () => {
  const total = 3

  it("returns the total when no daily availability is provided", () => {
    expect(getMinAvailableQuantity(tomorrow, inThreeDays, total, undefined)).toBe(total)
  })

  it("returns the minimum quantity across the date span", () => {
    const availability = {
      [toLocalDateKey(tomorrow)]: 2,
      [toLocalDateKey(inTwoDays)]: 1,
      [toLocalDateKey(inThreeDays)]: 3,
    }
    expect(getMinAvailableQuantity(tomorrow, inThreeDays, total, availability)).toBe(1)
  })
})

describe("rentNowSchema", () => {
  const valid = {
    gearItemId: "gear_1",
    startDate: tomorrow.toISOString(),
    endDate: inTwoDays.toISOString(),
    quantity: 1,
  }

  it("accepts a valid rental request", () => {
    expect(rentNowSchema.safeParse(valid).success).toBe(true)
  })

  it("rejects a start date after the end date", () => {
    const result = rentNowSchema.safeParse({ ...valid, startDate: inThreeDays.toISOString() })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toContain("Start date must be on or before")
  })

  it("rejects a start date in the past", () => {
    const yesterday = new Date(today.getTime() - dayInMs)
    const result = rentNowSchema.safeParse({ ...valid, startDate: yesterday.toISOString() })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toContain("today or later")
  })

  it("rejects a quantity below 1", () => {
    const result = rentNowSchema.safeParse({ ...valid, quantity: 0 })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].message).toContain("at least 1")
  })
})
