import { apiClient } from "./client"

export async function createPayment(rentalOrderId: string): Promise<{ paymentUrl: string }> {
  return apiClient("/payments/create", {
    method: "POST",
    body: JSON.stringify({ rentalOrderId }),
  })
}
