"use server"

import { jwtUtils } from "@/utils/jwt"
import { cookies } from "next/headers"

export const getNewAccessToken = async () => {
  const cookieStore = await cookies()

  const refreshToken = cookieStore.get("refreshToken")?.value || null

  if (!refreshToken) {
    return {
      success: false,
      message: "Refresh token not found!",
    }
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
      cache: "no-cache",
    }
  )

  const result = await res.json()

  return result
}

// Returns a valid access token for the current request, refreshing it from the
// backend when one has expired and a valid refresh token is available. Returns
// null when the user is not - or can no longer be - authenticated.
//
// IMPORTANT: this function never writes cookies. Refreshed tokens obtained here
// are for the current request only; Next.js forbids modifying cookies outside
// Server Actions / Route Handlers (e.g. during a Server Component render), and
// the `proxy` already persists the refreshed token to the browser via its
// response cookies.
export const getAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get("accessToken")?.value || null
  const refreshToken = cookieStore.get("refreshToken")?.value || null

  if (!accessToken && !refreshToken) {
    return null
  }

  const decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null

  // The access token is still valid, return it as-is.
  if (decodedAccessToken?.success) {
    return accessToken
  }

  // The access token has expired/invalid but the refresh token is valid - get a
  // new access token from the backend for this request.
  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      )
    : null

  if (decodedRefreshToken?.success) {
    const result = await getNewAccessToken()

    if (result.success && result.data?.accessToken) {
      return result.data.accessToken
    }
  }

  return null
}
