# Spec: Proxy & Auth Infrastructure

## Overview

Build the auth middleware (proxy.ts) for JWT token refresh, role-based route protection, and redirect logic. This is the security layer that protects all authenticated routes and ensures users land on the correct dashboard based on their role.

## Depends on

- `lib/types.ts` — Role type (CUSTOMER, PROVIDER, ADMIN)
- Next.js 16: proxy.ts at project root (NOT middleware.ts)
- Backend: `GET /api/auth/refresh-token` endpoint for token refresh
- Environment: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` in .env (for local token decoding)

## Routes

No new routes. This spec builds the proxy that protects all existing routes:

| Route pattern | Access | Redirect if |
|---------------|--------|-------------|
| `/` | Public | — |
| `/gear` | Public | — |
| `/gear/*` | Public | — |
| `/payment/*` | Public | — |
| `/auth/login` | Public (unauthenticated only) | Dashboard if logged in |
| `/auth/register` | Public (unauthenticated only) | Dashboard if logged in |
| `/dashboard/customer/*` | CUSTOMER only | /auth/login |
| `/dashboard/provider/*` | PROVIDER only | /auth/login |
| `/dashboard/admin/*` | ADMIN only | /auth/login |
| `/_next/*` | Public | — |

## Server actions / service

- `service/refreshToken.ts` — `"use server"` function: POST to refresh endpoint with refreshToken cookie, return new accessToken
- `service/getMe.ts` — `"use server"` function: read accessToken, fetch user (may already exist)

## Files to change

- `proxy.ts` at project root — create if not exists

## Files to create

- `proxy.ts` — root-level auth middleware
- `service/refreshToken.ts` — token refresh server action
- `utils/jwt.ts` — JWT decode/verify utility (using jsonwebtoken or Web Crypto API)

## New dependencies

- `jsonwebtoken` + `@types/jsonwebtoken` — for decoding JWT in proxy (needs synchronous verify)

## Rules for implementation

### Proxy logic (in order):

1. **Public routes** (`/`, `/gear`, `/gear/*`, `/payment/*`, `/_next/*`, `/api/*`, `/favicon.ico`) — always pass through

2. **Auth routes** (`/auth/login`, `/auth/register`):
   - If accessToken exists and valid → redirect to respective dashboard:
     - CUSTOMER → `/dashboard/customer`
     - PROVIDER → `/dashboard/provider`
     - ADMIN → `/dashboard/admin`
   - If no token → pass through

3. **Token refresh**:
   - If accessToken is expired/missing but refreshToken is valid → call `getNewAccessToken()` server action
   - If refresh succeeds → set new accessToken cookie, continue
   - If refresh fails → delete both cookies, redirect to `/auth/login` for protected routes

4. **Role-based protection** for dashboard routes:
   - `/dashboard/customer/*` → decoded role must be CUSTOMER, else redirect to `/auth/login`
   - `/dashboard/provider/*` → decoded role must be PROVIDER, else redirect to `/auth/login`
   - `/dashboard/admin/*` → decoded role must be ADMIN, else redirect to `/auth/login`

5. **Redirect tracking**:
   - When redirecting to `/auth/login` from a protected route, append `?redirectTo=<original_path>` so login can redirect back after success

### Implementation details:

- Proxy file is `proxy.ts` at project root, exports a named `proxy` function
- Use `NextResponse.next()`, `NextResponse.redirect()`, `NextResponse.rewrite()` as needed
- Config matcher: `"/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"`
- JWT verify synchronously using `jsonwebtoken.verify()` for performance
- Token cookies: `accessToken` (short-lived, ~15min), `refreshToken` (long-lived, ~7 days)
- Both cookies: `httpOnly: true`, `sameSite: "lax"`, `secure: true` in production
- matcher should exclude static files but include all pages

```
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$|.*\\.svg$).*)"],
}
```

## Definition of done

1. Unauthenticated users accessing `/dashboard/*` redirect to `/auth/login?redirectTo=/dashboard/...`
2. Authenticated CUSTOMER accessing `/dashboard/provider` redirects to `/auth/login`
3. Authenticated users visiting `/auth/login` redirect to their dashboard
4. Expired accessToken is silently refreshed via refreshToken (no visible redirect)
5. Expired refreshToken clears cookies and redirects to login
6. Public routes (`/`, `/gear`) work without any auth cookies
7. `npm run dev` works without errors; `npx tsc --noEmit` passes
