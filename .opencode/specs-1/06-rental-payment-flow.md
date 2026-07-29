# Spec: Rental & Payment Flow

## Overview

Build the rental checkout and payment flow. Customers select rental dates on the gear detail page, confirm in checkout, and are redirected to payment gateway. Payment success/failure is handled via dedicated pages.

## Depends on

- `lib/types.ts` — ICreateRentalPayload, IRentalOrder, IPayment types
- `lib/api/rentals.ts` — createRental, fetchMyRentals
- `lib/api/payments.ts` — createPayment (create if not exists)
- `hooks/useRentals.ts` — useCreateRental mutation
- `hooks/usePayments.ts` — useCreatePayment mutation
- `lib/api/client.ts` — base fetch client
- Backend endpoints: `POST /api/rentals`, `POST /api/payments/create`, `GET /api/payments/confirm`

## Routes

- `GET /gear/[id]` — Rent Now CTA with date picker (existing)
- `GET /dashboard/customer/orders/[id]/pay` — payment initiation page
- `GET /payment/success` — payment success confirmation
- `GET /payment/cancel` — payment cancelled/failed

## Components

- **Create:** `app/(publicGroup)/_components/RentalDatePicker.tsx` — start/end date inputs with min-date validation (no past dates), shows total price calculation live
- **Create:** `app/(publicGroup)/_components/RentalSummary.tsx` — summary card: gear name, dates, quantity, price breakdown, total
- **Create:** `app/(dashboardGroup)/customer/_components/PayButton.tsx` — payment initiation button with loading state, calls payment API
- **Create:** `app/(publicGroup)/_components/PaymentSuccess.tsx` — success page: checkmark animation (motion), order summary, "View My Orders" CTA
- **Create:** `app/(publicGroup)/_components/PaymentCancel.tsx` — cancel page: error state, "Try Again" and "Contact Support" CTAs

## Files to change

- `app/(publicGroup)/gear/[id]/page.tsx` — integrate RentalDatePicker + RentalSummary + "Rent Now" action
- `app/(dashboardGroup)/customer/orders/[id]/pay/page.tsx` — create, shows order summary + PayButton
- `app/(publicGroup)/payment/success/page.tsx` — create
- `app/(publicGroup)/payment/cancel/page.tsx` — create

## Files to create

- `app/(publicGroup)/_components/RentalDatePicker.tsx`
- `app/(publicGroup)/_components/RentalSummary.tsx`
- `app/(dashboardGroup)/customer/_components/PayButton.tsx`
- `app/(publicGroup)/_components/PaymentSuccess.tsx`
- `app/(publicGroup)/_components/PaymentCancel.tsx`
- `hooks/useRentals.ts` — useCreateRental
- `hooks/usePayments.ts` — useCreatePayment

## New dependencies

No new dependencies.

## Rules for implementation

- RentalDatePicker: two date inputs (start, end), min date = today, end date must be >= start date
- Live price calculation: `(endDate - startDate) × priceRatePerDay × quantity`
- "Rent Now" creates rental via `createRental` mutation:
  - On success → redirect to `/dashboard/customer` with success toast
  - For payment-required orders, redirect to `/dashboard/customer/orders/[id]/pay`
- PayButton calls `POST /api/payments/create` → expects redirect URL in response → `window.location.href = redirectUrl`
- Payment success page receives URL params (tranId, orderId), shows animated checkmark via Framer Motion (path drawing animation)
- Payment cancel page shows clear error message with retry CTA
- Handle loading: button spinner during rental creation and payment initiation
- Handle error: toast notifications for failures

## Definition of done

1. Gear detail page shows date picker with live price calculation
2. "Rent Now" creates rental order → redirects to payment or dashboard
3. `/dashboard/customer/orders/[id]/pay` shows order summary + payment button
4. Payment button calls backend and redirects to SSLCommerz/Stripe
5. `/payment/success` shows confirmation with animated checkmark
6. `/payment/cancel` shows error with retry option
7. `npm run dev` works without errors; `npx tsc --noEmit` passes
