import { getNewAccessToken } from "./service/refreshToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "./utils/jwt";
import { getSubscriptionStatus } from "./app/(publicGroup)/_actions/getSubscriptionStatus";

// list of auth routes
const AUTH_ROUTES = ["/login", "/register"];

// list of public routes
const PUBLIC_ROUTES = ["/", "/news", "/news/:id"];

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // console.log(pathname, "pathname");
  // console.log(request.nextUrl, "request");
  // console.log("Proxy");

  const cookieStore = await cookies();
  // const accessToken = cookieStore.get("accessToken")?.value;

  // to get a single value from cookies we need to use "cookies().get().value"
  // using "let" variable to store the new "access token" for every request
  let accessToken = request.cookies.get("accessToken")?.value;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  // decode the access token to get the payload object
  let decodedAccessToken = accessToken
    ? (jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      ) as JwtPayload)
    : null;

  // decode the refresh token
  const decodedRefreshToken = refreshToken
    ? (jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      ) as JwtPayload)
    : null;

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    console.log("refresh");
    // access token is invalid or has expired, but refresh token is valid, get new access token from backend server
    const result = await getNewAccessToken();
    console.log(result);

    if (result?.success) {
      const newAccessToken = result?.data?.accessToken;

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      accessToken = newAccessToken;

      decodedAccessToken = jwtUtils.verifyToken(
        accessToken as string,
        process.env.JWT_ACCESS_SECRET as string,
      );
    }
  }

  // to get the role from the payload
  let userRole = null;

  // if the access token is invalid or has expired, delete the cookie and redirect to the login page
  if (!decodedAccessToken?.success) {
    // token has expired or is invalid, clear the cookies
    cookieStore.delete("accessToken");
    // return NextResponse.redirect(new URL("/login", request.url));
  }

  // get the role from the payload if it exists
  if (decodedAccessToken?.success && decodedAccessToken?.data) {
    userRole = decodedAccessToken.data.role;
  }

  // user is logged in and trying to access login or register page, redirect to their dashboard or root home page
  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    if (userRole === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else if (userRole === "AUTHOR") {
      return NextResponse.redirect(new URL("/author-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // if the user is logged in and trying to access a public route, redirect to login page
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // if the user is logged in and trying to access a auth route, redirect to login page
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Authenticated pages protected : Authorization is not handled yet
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);

    // append the redirect parameter to the login url, means the user will be redirected to the same page after login
    loginUrl.searchParams.set("redirectTo", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Authorization: Role based access control
  if (pathname.startsWith("/dashboard") && userRole !== "USER") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (
    pathname.startsWith("/author-dashboard") &&
    userRole !== "AUTHOR"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // check if the user is subscribed to the premium plan
  // const subscriptionStatus = await getSubscriptionStatus();

  // const isActive = Boolean(
  //   subscriptionStatus?.success && subscriptionStatus.data?.isSubscribed,
  // );

  // check if the user is subscribed to the premium plan, if not, redirect to the payment page
  if (pathname === "/premium") {
    const subscriptionStatus = await getSubscriptionStatus();

    const isActive = Boolean(
      subscriptionStatus?.success && subscriptionStatus.data?.isSubscribed,
    );

    if (!isActive) {
      return NextResponse.redirect(new URL("/payment", request.url));
    }
  }

  // and if the user is subscribed, but trying to access the payment page, redirect to the premium page
  // if (pathname === "/payment") {
  //   const subscriptionStatus = await getSubscriptionStatus();

  //   const isActive = Boolean(
  //     subscriptionStatus?.success && subscriptionStatus.data?.isSubscribed,
  //   );

  //   if (isActive) {
  //     return NextResponse.redirect(new URL("/premium", request.url));
  //   }
  // }

  //   return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/dashboard/:path*",
    // "/admin-dashboard/:path*"
    "/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)",
  ],
};
