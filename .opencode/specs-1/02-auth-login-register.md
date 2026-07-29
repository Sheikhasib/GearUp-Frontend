# Spec: Auth — Login & Register

## Overview

Build the authentication flow. Users can register as CUSTOMER or PROVIDER, log in, and get redirected to their role-specific dashboard. proxy.ts handles token refresh and route protection.

## Depends on

- `lib/types.ts` — IUser, Role types
- `lib/api/client.ts` — fetch client for server actions
- `proxy.ts` — must exist (root-level middleware) for token refresh + role-based redirects
- `app/(authGroup)/` — route group must exist
- Backend endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`

## Routes

- `GET /auth/login` — login form
- `GET /auth/register` — registration form with role selector

## Server actions

- **Create:** `app/(authGroup)/_actions/authActions.ts`
  - `loginAction(email, password)` — POST `/api/auth/login`, set `accessToken` + `refreshToken` httpOnly cookies via `cookies().set()`, redirect based on role
  - `registerAction(name, email, password, role)` — POST `/api/auth/register`, on success redirect to login

## Components

- **Create:** `app/(authGroup)/_components/LoginForm.tsx` — email/password inputs, Zod validation, inline errors, loading button state
- **Create:** `app/(authGroup)/_components/RegisterForm.tsx` — name/email/password/confirm-password/role-selector, Zod validation, inline errors
- **Create:** `app/(authGroup)/_components/RoleSelector.tsx` — two-card selector (Customer / Provider) with icon + description, motion select animation

## Files to change

- `app/(authGroup)/login/page.tsx` — render LoginForm
- `app/(authGroup)/register/page.tsx` — render RegisterForm

## Files to create

- `app/(authGroup)/_actions/authActions.ts`
- `app/(authGroup)/_components/LoginForm.tsx`
- `app/(authGroup)/_components/RegisterForm.tsx`
- `app/(authGroup)/_components/RoleSelector.tsx`
- `service/getMe.ts` — server-only function: read cookie, fetch `GET /api/auth/me`, return user or null
- `service/logout.ts` — server-only function: clear accessToken/refreshToken cookies
- `service/refreshToken.ts` — server-only function: POST to refresh endpoint, return new accessToken

## New dependencies

- `zod` — form validation (if not already installed)
- `sonner` — toast notifications (part of shadcn default)

## Rules for implementation

- Server actions must use `"use server"` directive
- Use `cookies()` from `next/headers` to set/read/delete httpOnly cookies
- After login, redirect via `redirect()` from `next/navigation`:
  - CUSTOMER → `/dashboard/customer`
  - PROVIDER → `/dashboard/provider`
  - ADMIN → `/dashboard/admin`
- RoleSelector must be animated: `motion.div` with `whileTap={{ scale: 0.97 }}`, selected state with border + bg highlight
- All buttons must show loading spinner and `disabled` state during async
- Zod schemas: email format, password min 6 chars, name min 2 chars
- Inline validation errors below each input (red text, small)
- proxy.ts must redirect authenticated users away from `/auth/*` to their dashboard

## Definition of done

1. `/auth/register` shows role selector + form; submitting creates account and redirects to login
2. `/auth/login` shows login form; submitting sets cookies and redirects to correct dashboard
3. Invalid credentials show inline error message
4. Authenticated users visiting `/auth/*` get redirected to their dashboard
5. `npm run dev` works without errors; `npx tsc --noEmit` passes
