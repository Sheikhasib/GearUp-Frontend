import { apiClient } from "./client"
import type { IPayment } from "@/lib/types"

export async function createPayment(rentalOrderId: string): Promise<{ paymentUrl: string }> {
  return apiClient("/payments/create", {
    method: "POST",
    body: JSON.stringify({ rentalOrderId }),
  })
}

export async function fetchMyPayments(): Promise<IPayment[]> {
  const payments = await apiClient<IPayment[]>("/payments/customer")
  return [...payments].sort(
    (a, b) =>
      new Date(b.paidAt ?? 0).getTime() - new Date(a.paidAt ?? 0).getTime()
  )
}
