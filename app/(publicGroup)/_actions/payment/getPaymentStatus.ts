"use server"

import { getAccessToken } from "@/service/refreshToken"

export const getPaymentStatus = async (orderId: string) => {
  const accessToken = await getAccessToken()

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
