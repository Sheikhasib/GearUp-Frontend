"use server"

import { cookies } from "next/headers"

export const getPaymentStatus = async (orderId: string) => {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get("accessToken")?.value || null

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in!",
    }
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/payments/status/${orderId}`,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-cache",
    },
  )

  const result = await res.json()

  return result
}
