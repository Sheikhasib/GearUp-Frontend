import { apiClient } from "./client"
import type { ICreateGearPayload, IGearItem, IUpdateGearPayload, IRentalOrder } from "@/lib/types"

export async function createGear(payload: ICreateGearPayload): Promise<IGearItem> {
  return apiClient("/provider/gear", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function fetchMyGear(): Promise<IGearItem[]> {
  return apiClient("/provider/my-gear")
}

export async function updateGear(id: string, payload: IUpdateGearPayload): Promise<IGearItem> {
  return apiClient(`/provider/gear/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteGear(id: string): Promise<void> {
  return apiClient(`/provider/gear/${id}`, {
    method: "DELETE",
  })
}

export async function fetchIncomingOrders(): Promise<IRentalOrder[]> {
  const orders = await apiClient<IRentalOrder[]>("/provider/rentalOrders")
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function updateOrderStatus(id: string, status: string): Promise<IRentalOrder> {
  return apiClient(`/provider/rentalOrders/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
