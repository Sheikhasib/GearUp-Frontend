"use server"

import type { IReview } from "@/lib/types"

const API_BASE = process.env.BACKEND_API_URL || "http://localhost:4000"

export interface IGearReviewsResponse {
  data: IReview[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function fetchGearReviewsServer(
  gearId: string,
  page = 1,
  limit = 10
): Promise<IGearReviewsResponse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/gear/${gearId}/reviews?page=${page}&limit=${limit}`,
      { cache: "no-cache" }
    )
    if (!res.ok) return null
    const json = await res.json()
    if (!json.success) return null
    return json as IGearReviewsResponse
  } catch {
    return null
  }
}
