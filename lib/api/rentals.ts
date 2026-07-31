import { apiClient } from "./client"
import type { ICreateRentalPayload, IRentalOrder } from "@/lib/types"

export async function createRental(payload: ICreateRentalPayload): Promise<IRentalOrder> {
  return apiClient("/rentals", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function fetchMyRentals(): Promise<IRentalOrder[]> {
  return apiClient("/rentals")
}

export async function fetchRentalById(id: string): Promise<IRentalOrder> {
  return apiClient(`/rentals/${id}`)
}

export async function cancelRental(id: string): Promise<IRentalOrder> {
  return apiClient(`/rentals/cancel/${id}`, {
    method: "PATCH",
  })
}
