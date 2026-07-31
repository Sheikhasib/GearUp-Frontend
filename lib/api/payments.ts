import { apiClient } from "./client"
import type { IPayment } from "@/lib/types"

export async function createPayment(rentalOrderId: string): Promise<{ paymentUrl: string }> {
  return apiClient("/payments/create", {
    method: "POST",
    body: JSON.stringify({ rentalOrderId }),
  })
}

export async function fetchMyPayments(): Promise<IPayment[]> {
  return apiClient("/payments/customer")
}
