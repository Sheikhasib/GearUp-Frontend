"use server"

import { getAccessToken } from "@/service/refreshToken"
import { reviewSchema } from "@/lib/validations/review"
import type { ReviewInput } from "@/lib/validations/review"

const API_BASE = process.env.BACKEND_API_URL || "http://localhost:4000"

export type ReviewActionState = {
  success: boolean
  message: string
}

export async function createReviewAction(data: ReviewInput): Promise<ReviewActionState> {
  const parsed = reviewSchema.safeParse(data)
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues.map((e) => e.message).join(", "),
    }
  }

  const accessToken = await getAccessToken()
  if (!accessToken) {
    return {
      success: false,
      message: "You are not logged in.",
    }
  }

  try {
    const res = await fetch(`${API_BASE}/api/reviews`, {
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
        message: result.message || "Failed to submit review",
      }
    }

    return { success: true, message: "Review submitted successfully" }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Failed to submit review",
    }
  }
}
