# Spec: Customer Dashboard

## Overview

Build the customer dashboard. Customers can view their rental order history with status badges, payment history, and submit reviews for returned gear.

## Depends on

- `lib/types.ts` — IRentalOrder, IPayment, IReview types
- `lib/api/rentals.ts` — fetchMyRentals, cancelRental
- `lib/api/payments.ts` — fetchPayments (create if not exists)
- `lib/api/reviews.ts` — createReview (create if not exists)
- `hooks/useRentals.ts` — useQuery + useMutation for rentals
- `hooks/usePayments.ts` — useQuery + useMutation for payments
- `hooks/useReviews.ts` — useMutation for reviews
- `app/(dashboardGroup)/` layout — must exist with sidebar
- `proxy.ts` — must block non-CUSTOMER access to `/dashboard/customer/*`

## Routes

- `GET /dashboard/customer` — rental order history + stats overview
- `GET /dashboard/customer/orders/[id]/pay` — payment initiation page

## Components

- **Create:** `app/(dashboardGroup)/customer/_components/OrderCard.tsx` — order summary card: gear image, name, dates, total price, status badge, action buttons
- **Create:** `app/(dashboardGroup)/customer/_components/OrderTable.tsx` — table of all orders with sortable columns, status badges, cancel action
- **Create:** `app/(dashboardGroup)/customer/_components/StatusBadge.tsx` — colored pill badge mapping RentalStatus → color scheme
- **Create:** `app/(dashboardGroup)/customer/_components/PaymentHistory.tsx` — table of payments with amount, date, status
- **Create:** `app/(dashboardGroup)/customer/_components/ReviewForm.tsx` — star rating (1-5) + comment textarea, submit mutation
- **Create:** `app/(dashboardGroup)/_components/StatsCard.tsx` — reusable metric card (icon, label, value)
- **Create:** `app/(dashboardGroup)/_components/Skeleton.tsx` — generic skeleton components (card, table row)

## Files to change

- `app/(dashboardGroup)/customer/page.tsx` — build dashboard with stats + order list + payment history
- `app/(dashboardGroup)/customer/orders/[id]/pay/page.tsx` — payment initiation

## Files to create

- `app/(dashboardGroup)/customer/_components/OrderCard.tsx`
- `app/(dashboardGroup)/customer/_components/OrderTable.tsx`
- `app/(dashboardGroup)/customer/_components/StatusBadge.tsx`
- `app/(dashboardGroup)/customer/_components/PaymentHistory.tsx`
- `app/(dashboardGroup)/customer/_components/ReviewForm.tsx`
- `app/(dashboardGroup)/_components/StatsCard.tsx`
- `app/(dashboardGroup)/_components/Skeleton.tsx`
- `lib/api/payments.ts` — fetchPayments, createPayment
- `lib/api/reviews.ts` — createReview
- `hooks/useRentals.ts` — useMyRentals, useCancelRental
- `hooks/usePayments.ts` — usePaymentHistory
- `hooks/useReviews.ts` — useCreateReview

## New dependencies

No new dependencies.

## Rules for implementation

- StatusBadge color mapping:
  - PLACED → yellow, CONFIRMED → blue, PAID → purple
  - PICKED_UP → green, RETURNED → gray, CANCELLED → red
- Use TanStack Query with `queryClient.invalidateQueries` after mutations
- "Cancel" button only shown for PLACED/CONFIRMED orders
- "Leave Review" button only shown for RETURNED orders
- "Pay Now" button on CONFIRMED orders → links to `/dashboard/customer/orders/[id]/pay`
- ReviewForm: 5 star clickable rating (motion scale on hover), textarea, submit button
- All mutation buttons must have loading + disabled state
- Handle empty: "No orders yet. Browse gear to get started!" with link to `/gear`
- Skeleton loaders for initial data fetch (not spinners)

## Definition of done

1. `/dashboard/customer` shows: stat cards (total orders, active rentals, returned), order history table with status badges, payment history
2. Orders can be cancelled (if PLACED/CONFIRMED)
3. RETURNED orders show "Leave Review" button → opens review form
4. CONFIRMED orders show "Pay Now" button
5. Status badges use correct colors per rental status
6. `npm run dev` works without errors; `npx tsc --noEmit` passes
