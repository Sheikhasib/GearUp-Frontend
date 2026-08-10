import { getNewAccessToken } from "./service/refreshToken"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtUtils } from "./utils/jwt"
import type { JwtPayload } from "jsonwebtoken"
import { getPaymentStatus } from "./app/(publicGroup)/_actions/payment/getPaymentStatus"

const AUTH_ROUTES = ["/login", "/register"]

const PUBLIC_ROUTES = [
  "/",
  "/gears",
  "/categories",
  "/about",
  "/contact",
  "/services",
  "/help",
  "/privacy",
  "/terms",
  "/payment/success",
  "/payment/cancel",
]

const ROLE_DASHBOARD: Record<string, string> = {
  CUSTOMER: "/customer-dashboard",
  PROVIDER: "/provider-dashboard",
  ADMIN: "/admin-dashboard",
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const cookieStore = await cookies()

  let accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  let decodedAccessToken = accessToken
    ? (jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload)
    : null

  const decodedRefreshToken = refreshToken
    ? (jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as JwtPayload)
    : null

  // If the access token is invalid or expired, but the refresh token is valid, attempt to get a new access token
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    // console.log("refresh")
    const result = await getNewAccessToken()
    // console.log(result)

    if (result?.success) {
      const newAccessToken = result?.data?.accessToken

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      })

      cookieStore.set("accessTokenClient", newAccessToken, {
        httpOnly: false,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      })

      accessToken = newAccessToken

      decodedAccessToken = jwtUtils.verifyToken(
        accessToken as string,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload
    }
  }

  let userRole: string | null = null

  // Only clear the access cookies when the refresh token is ALSO invalid/expired.
  // Otherwise a transient refresh failure would silently log the user out even
  // though a still-valid refresh token could restore their session on the next
  // request.
  if (!decodedAccessToken?.success && !decodedRefreshToken?.success) {
    cookieStore.delete("accessToken")
    cookieStore.delete("accessTokenClient")
  }

  // If the access token is valid, extract the user role from it
  if (decodedAccessToken?.success && decodedAccessToken?.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role as string
  }

  // If the user is authenticated and tries to access an auth route, redirect them to their respective dashboard or home page
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    const target = userRole ? ROLE_DASHBOARD[userRole] || "/" : "/"
    return NextResponse.redirect(new URL(target, request.url))
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )

  // If the user is not authenticated and tries to access a protected route, redirect them to the login page
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based access control
  if (pathname.startsWith("/customer-dashboard") && userRole !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/not-found", request.url))
  }
  if (pathname.startsWith("/provider-dashboard") && userRole !== "PROVIDER") {
    return NextResponse.redirect(new URL("/not-found", request.url))
  }
  if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url))
  }

  // Payment status check for success and cancel routes
  if (
    accessToken &&
    (pathname === "/payment/success" || pathname === "/payment/cancel")
  ) {
    const orderId = request.nextUrl.searchParams.get("orderId")
    if (orderId) {
      const paymentStatus = await getPaymentStatus(orderId)
      const isPaid = Boolean(
        paymentStatus?.success && paymentStatus.data?.isPaid
      )

      if (pathname === "/payment/success" && !isPaid) {
        return NextResponse.redirect(
          new URL("/customer-dashboard", request.url)
        )
      }

      if (pathname === "/payment/cancel" && isPaid) {
        return NextResponse.redirect(
          new URL(`/payment/success?orderId=${orderId}`, request.url)
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
}
