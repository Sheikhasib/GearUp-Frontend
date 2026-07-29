# Spec: Dashboard Layout & Navigation

## Overview

Build the shared dashboard layout with role-aware navbar and sidebar. The layout fetches the current user, renders the correct navigation based on role (CUSTOMER, PROVIDER, ADMIN), and wraps all dashboard pages. Sidebar collapses to a sheet on mobile.

## Depends on

- `lib/types.ts` — IUser, Role types
- `app/(dashboardGroup)/layout.tsx` — must exist or be created
- `components/shared/` — shared components directory
- `service/getMe.ts` — server-only function to fetch current user (create if not exists)
- `proxy.ts` — auth middleware for role-based route protection (create if not exists)

## Routes

No new routes. This spec builds the layout that wraps all existing dashboard routes:
- `/dashboard/customer/*`
- `/dashboard/provider/*`
- `/dashboard/admin/*`

## Components

**Create:**
- `components/shared/navbar.tsx` — top navigation bar:
  - Logo/brand link to home
  - User avatar + name dropdown (Profile, Logout)
  - Mobile hamburger to open sidebar sheet
  - `backdrop-blur-md bg-background/80` floating style
- `components/shared/dashboard-sidebar.tsx` — left sidebar navigation:
  - Menu items grouped by role (defined in sidebar config)
  - Active route highlight
  - Collapsible on mobile via Sheet
  - Motion slide animation
- `app/(dashboardGroup)/_config/sidebar-menu.ts` — menu item definitions per role:
  - CUSTOMER: Dashboard, My Orders, Payment History
  - PROVIDER: Dashboard, My Gear, Add Gear, Incoming Orders
  - ADMIN: Dashboard, Users, All Gear, All Orders
- `components/shared/user-menu.tsx` — avatar + dropdown with profile link and logout action

**Create (auth service files):**
- `service/getMe.ts` — `"use server"` function: read accessToken cookie, fetch `GET /api/auth/me`, return user or null
- `service/logout.ts` — `"use server"` function: delete accessToken and refreshToken cookies

## Files to change

- `app/(dashboardGroup)/layout.tsx` — fetch user via getMe(), render Navbar + Sidebar + main content
- Root layout or individual page layouts if needed

## Files to create

- `components/shared/navbar.tsx`
- `components/shared/dashboard-sidebar.tsx`
- `app/(dashboardGroup)/_config/sidebar-menu.ts`
- `components/shared/user-menu.tsx`
- `service/getMe.ts`
- `service/logout.ts`

## New dependencies

No new dependencies.

## Rules for implementation

- `app/(dashboardGroup)/layout.tsx` is a **server component** — fetches user with getMe(), passes as prop to client components
- Navbar and Sidebar are **client components** — receive user as prop, handle interactivity (dropdown, sheet, logout)
- Sidebar menu items defined in config file as arrays per role, not hardcoded in component
- Active route highlighted using `usePathname()`
- Mobile: sidebar lives in a shadcn Sheet triggered by hamburger icon
- Desktop: sidebar is fixed left, 260px wide, with `h-screen` and `overflow-y-auto`
- Logout calls server action, then redirects to home
- User menu: show avatar (first letter if no image), dropdown with Profile link + Logout
- Navbar is sticky with `backdrop-blur-md bg-background/80` (not solid)
- All navigation items have `cursor-pointer` and `transition-colors`
- Motion: Sidebar slides in on mobile (`AnimatePresence` with `motion.div`)

## Definition of done

1. `/dashboard/customer` shows navbar with user menu + sidebar with Customer menu items
2. `/dashboard/provider` shows sidebar with Provider menu items (Dashboard, My Gear, Add Gear, Orders)
3. `/dashboard/admin` shows sidebar with Admin menu items (Dashboard, Users, Gear, Orders)
4. Active route is highlighted in sidebar
5. Mobile sidebar opens as slide-over sheet
6. User menu dropdown shows Profile + Logout
7. Logout clears cookies and redirects to home
8. `npm run dev` works without errors; `npx tsc --noEmit` passes
