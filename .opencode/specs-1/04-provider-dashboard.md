# Spec: Provider Dashboard

## Overview

Build the provider dashboard. Providers can view their gear inventory, add/edit/remove gear listings (with Cloudinary image upload), and manage incoming rental orders with status updates.

## Depends on

- `lib/types.ts` — IGearItem, ICreateGearPayload, IRentalOrder types
- `lib/api/provider.ts` — createGear, fetchMyGear, updateGear, deleteGear, fetchIncomingOrders, updateOrderStatus
- `hooks/useProvider.ts` — useQuery + useMutation hooks
- `components/shared/gear-image-upload.tsx` — Cloudinary upload widget
- `app/(dashboardGroup)/` layout — must exist with sidebar
- `proxy.ts` — must block non-PROVIDER access to `/dashboard/provider/*`
- Backend endpoints: `POST /api/provider/gear`, `GET /api/provider/my-gear`, `PATCH /api/provider/gear/:id`, `DELETE /api/provider/gear/:id`, `GET /api/provider/rentalOrders`, `PATCH /api/provider/rentalOrders/:id`

## Routes

- `GET /dashboard/provider` — overview: stats (total gear, active rentals, pending orders), recent activity
- `GET /dashboard/provider/gear/new` — add gear form (exists, functional)
- `GET /dashboard/provider/gear/[id]/edit` — edit gear form
- `GET /dashboard/provider/orders` — incoming orders management table

## Components

- **Create:** `app/(dashboardGroup)/provider/_components/InventoryTable.tsx` — table of provider's gear: image thumb, name, category, price, available qty, status toggle, edit/delete actions
- **Create:** `app/(dashboardGroup)/provider/_components/GearForm.tsx` — reusable form for add/edit gear (name, description, brand, category, price, quantity, image upload)
- **Create:** `app/(dashboardGroup)/provider/_components/IncomingOrdersTable.tsx` — table of rental orders: customer name, gear, dates, quantity, total, status badge, action buttons per status
- **Create:** `app/(dashboardGroup)/provider/_components/OrderActionButtons.tsx` — dynamic buttons based on current status:
  - PLACED → "Confirm" button
  - PAID → "Mark Picked Up"
  - PICKED_UP → "Mark Returned"

## Files to change

- `app/(dashboardGroup)/provider/page.tsx` — build dashboard with stats + inventory table
- `app/(dashboardGroup)/provider/gear/new/page.tsx` — refactor to use GearForm component
- `app/(dashboardGroup)/provider/orders/page.tsx` — create if not exists
- `hooks/useProvider.ts` — add useUpdateGear, useMyGear, useIncomingOrders, useUpdateOrderStatus hooks

## Files to create

- `app/(dashboardGroup)/provider/_components/InventoryTable.tsx`
- `app/(dashboardGroup)/provider/_components/GearForm.tsx`
- `app/(dashboardGroup)/provider/_components/IncomingOrdersTable.tsx`
- `app/(dashboardGroup)/provider/_components/OrderActionButtons.tsx`
- `app/(dashboardGroup)/provider/gear/[id]/edit/page.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- GearForm must be reusable: accept optional `initialData` for edit mode, render "Create" vs "Update" button text
- GearForm image upload uses GearImageUpload component (Cloudinary widget)
- Inventory table rows must have `cursor-pointer` hover state
- Delete action must show confirmation (window.confirm or shadcn AlertDialog)
- Order actions use optimistic updates via TanStack Query `onMutate`:
  - Immediately update the cache, roll back on error
  - Invalidate `["incoming-orders"]` on settle
- Order status flow: PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED
  - PAID is set by payment, not provider
  - Provider sees: PLACED → Confirm, PAID → Mark Picked Up, PICKED_UP → Mark Returned
- Toast notifications for all mutations (success/error) via sonner
- Handle empty: "No gear listed yet" with CTA to add first gear
- Handle empty orders: "No incoming orders"
- Skeleton loaders for tables

## Definition of done

1. `/dashboard/provider` shows stat cards + inventory table with edit/delete
2. `/dashboard/provider/gear/new` creates gear with Cloudinary image upload
3. `/dashboard/provider/gear/[id]/edit` pre-fills form, updates gear on submit
4. `/dashboard/provider/orders` shows incoming orders table with status action buttons
5. Order status updates work with optimistic UI + toast feedback
6. `npm run dev` works without errors; `npx tsc --noEmit` passes
