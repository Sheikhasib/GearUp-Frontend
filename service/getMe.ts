"use server"

import { getAccessToken } from "@/service/refreshToken"

export const getMe = async () => {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return {
      success: false,
      message: "Unauthorized User. Please Login with valid credentials.",
    }
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "no-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["my-profile"],
    },
  })

  const result = await res.json()

  return result
}
