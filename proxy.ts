import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { JwtPayload } from "jsonwebtoken"
import { jwtUtils } from "@/utils/jwt"

const ROLE_DASHBOARD: Record<string, string> = {
  CUSTOMER: "/customer-dashboard",
  PROVIDER: "/provider-dashboard",
  ADMIN: "/admin-dashboard",
}

const DASHBOARD_PREFIXES = ["/customer-dashboard", "/provider-dashboard", "/admin-dashboard", "/provider/"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get("accessToken")?.value

  const decoded = accessToken
    ? (jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      ) as { success: boolean; data?: JwtPayload })
    : null

  const userRole = decoded?.success ? (decoded.data as JwtPayload).role as string : null

  const isAuthRoute = pathname === "/login" || pathname === "/register"

  // already logged in → skip auth pages
  if (accessToken && isAuthRoute) {
    const target = userRole && ROLE_DASHBOARD[userRole] ? ROLE_DASHBOARD[userRole] : "/customer-dashboard"
    return NextResponse.redirect(new URL(target, request.url))
  }

  const isProtected = DASHBOARD_PREFIXES.some((p) => pathname.startsWith(p))

  if (isProtected) {
    if (!decoded?.success) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete("accessToken")
      response.cookies.delete("refreshToken")
      return response
    }

    const expectedRole = DASHBOARD_PREFIXES.reduce<string | null>((match, prefix) => {
      if (pathname.startsWith(prefix)) {
        const roleKey = prefix.replace("/-dashboard", "").replace("/", "").toUpperCase()
        if (ROLE_DASHBOARD[roleKey]) return roleKey
        if (prefix === "/provider/") return "PROVIDER"
      }
      return match
    }, null)

    if (expectedRole && userRole !== expectedRole) {
      const target = ROLE_DASHBOARD[userRole!] || "/login"
      return NextResponse.redirect(new URL(target, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/customer-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/provider-dashboard/:path*",
    "/provider/:path*",
  ],
}
