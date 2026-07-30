"use server"

import { redirect } from "next/navigation"
import { createPayment } from "@/lib/api/payments"

export type PaymentActionState = {
  success: boolean
  message: string
}

export async function createPaymentAction(
  rentalOrderId: string,
  _formData: FormData
): Promise<void> {
  try {
    const result = await createPayment(rentalOrderId)
    if (result.paymentUrl) {
      redirect(result.paymentUrl)
    }
  } catch {
    redirect(`/customer-dashboard/orders/${rentalOrderId}/pay?error=Payment+initiation+failed`)
  }
}
