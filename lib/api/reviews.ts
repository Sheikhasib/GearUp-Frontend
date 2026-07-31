import { apiClient } from "./client"
import type { IReview } from "@/lib/types"

export interface ICreateReviewPayload {
  rentalOrderId: string
  rating: number
  comment?: string
}

export async function createReview(payload: ICreateReviewPayload): Promise<IReview> {
  return apiClient("/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
