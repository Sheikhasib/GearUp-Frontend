"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function createPaymentAction(
  rentalOrderId: string,
  _formData: FormData
): Promise<void> {
  let paymentUrl: string | null = null

  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) {
      throw new Error("Not authenticated")
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ rentalOrderId }),
      cache: "no-cache",
    })

    const result = await res.json()

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Payment initiation failed")
    }

    paymentUrl = result.data?.paymentUrl?.paymentUrl ?? null
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Payment initiation failed"
    redirect(
      `/customer-dashboard/orders/${rentalOrderId}/pay?error=${encodeURIComponent(message)}`
    )
  }

  if (paymentUrl) {
    redirect(paymentUrl)
  }
}
