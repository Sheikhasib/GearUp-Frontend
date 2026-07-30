import { getNewAccessToken } from "./service/refreshToken"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtUtils } from "./utils/jwt"
import type { JwtPayload } from "jsonwebtoken"

const AUTH_ROUTES = ["/login", "/register"]

const PUBLIC_ROUTES = ["/", "/gears", "/about", "/contact", "/services"]

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

      accessToken = newAccessToken

      decodedAccessToken = jwtUtils.verifyToken(
        accessToken as string,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload
    }
  }

  let userRole: string | null = null

  if (!decodedAccessToken?.success) {
    cookieStore.delete("accessToken")
  }

  if (decodedAccessToken?.success && decodedAccessToken?.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role as string
  }

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

  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith("/customer-dashboard") && userRole !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/not-found", request.url))
  }
  if (pathname.startsWith("/provider-dashboard") && userRole !== "PROVIDER") {
    return NextResponse.redirect(new URL("/not-found", request.url))
  }
  if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url))
  }
  if (pathname.startsWith("/provider/") && userRole !== "PROVIDER") {
    return NextResponse.redirect(new URL("/not-found", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
}
