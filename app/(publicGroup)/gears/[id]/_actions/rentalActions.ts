"use server"

import { redirect } from "next/navigation"
import { rentNowSchema } from "@/lib/validations/rental"
import { createRental } from "@/lib/api/rentals"
import type { RentNowInput } from "@/lib/validations/rental"

export type RentalActionState = {
  success: boolean
  message: string
}

export async function createRentalOrderAction(data: RentNowInput): Promise<RentalActionState> {
  const parsed = rentNowSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((e) => e.message).join(", "),
    }
  }

  try {
    await createRental(parsed.data)
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to create rental order",
    }
  }

  redirect("/customer-dashboard?orderCreated=true")
}
