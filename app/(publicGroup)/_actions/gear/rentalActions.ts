"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { rentNowSchema, areDateRangesOverlapping } from "@/lib/validations/rental"
import type { RentNowInput } from "@/lib/validations/rental"

const API_BASE = process.env.BACKEND_API_URL || "http://localhost:4000"

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

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  if (!accessToken) {
    return {
      success: false,
      message: "You are not logged in. Please log in to continue.",
    }
  }

  try {
    const gearRes = await fetch(`${API_BASE}/api/gear/${parsed.data.gearItemId}`, {
      cache: "no-cache",
    })
    if (gearRes.ok) {
      const gearJson = await gearRes.json()
      const gear = gearJson.data ?? gearJson
      const unavailableRanges = gear?.unavailableRanges

      if (
        unavailableRanges?.length &&
        areDateRangesOverlapping(
          { startDate: parsed.data.startDate, endDate: parsed.data.endDate },
          unavailableRanges
        )
      ) {
        return {
          success: false,
          message:
            "The selected dates overlap with an already-booked period. Please choose different dates.",
        }
      }
    }

    const res = await fetch(`${API_BASE}/api/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(parsed.data),
      cache: "no-cache",
    })

    const result = await res.json()

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to create rental order",
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to create rental order",
    }
  }

  redirect("/customer-dashboard?orderCreated=true")
}
