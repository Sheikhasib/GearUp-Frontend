# Spec: Admin Dashboard

## Overview

Build the admin dashboard. Admins can view platform-wide statistics, manage users (suspend/activate), moderate all gear listings, and view all rental orders across the platform.

## Depends on

- `lib/types.ts` — IUser, IGearItem, IRentalOrder types
- `lib/api/admin.ts` — fetchUsers, updateUserStatus, fetchAllGear, fetchAllOrders (create)
- `hooks/useAdmin.ts` — useQuery + useMutation hooks (create)
- `app/(dashboardGroup)/` layout — must exist with sidebar
- `proxy.ts` — must block non-ADMIN access to `/dashboard/admin/*`
- Backend endpoints: `GET /api/admin/users`, `PATCH /api/admin/users/:id`, `GET /api/admin/gear`, `GET /api/admin/rentalOrders`

## Routes

- `GET /dashboard/admin` — platform overview: total users, active gear, total rentals, recent registrations
- `GET /dashboard/admin/users` — user management table
- `GET /dashboard/admin/gear` — all gear moderation
- `GET /dashboard/admin/orders` — all rental orders

## Components

- **Create:** `app/(dashboardGroup)/admin/_components/AdminStats.tsx` — 4-stat-card grid (users, gear, orders, revenue)
- **Create:** `app/(dashboardGroup)/admin/_components/UserTable.tsx` — table of all users: name, email, role, status badge, join date, suspend/activate toggle button
- **Create:** `app/(dashboardGroup)/admin/_components/GearModerationTable.tsx` — table of all gear: image, name, provider, category, price, availability, delete action
- **Create:** `app/(dashboardGroup)/admin/_components/OrdersTable.tsx` — table of all orders: customer, provider, gear, dates, status badge, total price

## Files to change

- `app/(dashboardGroup)/admin/page.tsx` — build with AdminStats
- `app/(dashboardGroup)/admin/users/page.tsx` — create if not exists
- `app/(dashboardGroup)/admin/gear/page.tsx` — create if not exists
- `app/(dashboardGroup)/admin/orders/page.tsx` — create if not exists

## Files to create

- `lib/api/admin.ts` — fetchUsers, updateUserStatus, fetchAllGear, fetchAllOrders
- `hooks/useAdmin.ts` — useUsers, useUpdateUserStatus, useAllGear, useAllOrders
- `app/(dashboardGroup)/admin/_components/AdminStats.tsx`
- `app/(dashboardGroup)/admin/_components/UserTable.tsx`
- `app/(dashboardGroup)/admin/_components/GearModerationTable.tsx`
- `app/(dashboardGroup)/admin/_components/OrdersTable.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- UserTable: status badge (ACTIVE → green, SUSPENDED → red); toggle button calls `updateUserStatus` mutation
- Admin cannot suspend themselves — hide/disable toggle on own row
- Suspend/Activate uses TanStack Query mutation with `onMutate` optimistic update + rollback on error
- Toast notifications for all admin actions
- All tables must have loading skeleton state and empty state messages
- GearModerationTable: delete action removes gear permanently (with confirmation dialog)
- OrdersTable: read-only view of all platform orders, no action buttons for admin
- AdminStats should show skeleton placeholders while loading
- Handle error with user-friendly message + retry

## Definition of done

1. `/dashboard/admin` shows 4 stat cards (users, gear, orders)
2. `/dashboard/admin/users` shows all users with suspend/activate toggles
3. `/dashboard/admin/gear` shows all gear with delete moderation
4. `/dashboard/admin/orders` shows all rental orders (read-only)
5. Suspend/activate works with optimistic UI + toast
6. `npm run dev` works without errors; `npx tsc --noEmit` passes
