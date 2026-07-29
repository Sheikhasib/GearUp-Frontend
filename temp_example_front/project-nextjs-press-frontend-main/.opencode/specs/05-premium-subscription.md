# Spec: Premium Subscription

## Overview

Complete the premium subscription flow. Users can view pricing, subscribe via a payment gateway redirect (Stripe/SSLCommerz), and manage their subscription from the dashboard. Premium-gated content is already handled — this spec focuses on the subscription lifecycle and user-facing management.

## Depends on

- `app/(publicGroup)/payment/page.tsx` — exists, renders PricingSection with Suspense
- `app/(publicGroup)/premium/page.tsx` — exists, renders PremiumNewsList with search
- `app/(publicGroup)/_components/payment/PricingSection.tsx` — exists, shows plan + active status + subscribe button
- `app/(publicGroup)/_components/payment/SubscribeButton.tsx` — exists, triggers subscribePremium action
- `app/(publicGroup)/_components/payment/PricingSectionLoader.tsx` — exists, skeleton loader
- `app/(publicGroup)/_actions/subscribePremium.ts` — exists, POSTs to `/api/subscription/checkout`, redirects to paymentUrl
- `app/(publicGroup)/_actions/getSubscriptionStatus.ts` — exists, fetches subscription status from backend
- `app/(publicGroup)/_actions/getPremiumNews.ts` — exists, fetches premium posts with cookie auth
- `proxy.ts` — premium page redirects unsubscribed users to /payment

## Routes

All under existing route groups — no new routes needed.

## Server actions

- **Create:** `app/(dashboardGroup)/_actions/subscriptionActions.ts` — `cancelSubscription()` to cancel active plan; `getBillingHistory()` to fetch past payments/invoices
- **Modify:** `app/(publicGroup)/_actions/subscribePremium.ts` — add `planId` or `priceId` parameter support if multiple plans exist

## Components

- **Modify:** `app/(publicGroup)/_components/payment/PricingSection.tsx` — show subscription end date always (not just when active); add plan details (price, billing cycle) fetched from backend
- **Modify:** `app/(publicGroup)/_components/payment/SubscribeButton.tsx` — disable button if already subscribed; show "Manage Subscription" instead when active
- **Create:** `app/(dashboardGroup)/_components/SubscriptionStatusCard.tsx` — dashboard card showing plan, status, renewal date, cancel button
- **Create:** `app/(dashboardGroup)/_components/BillingHistoryTable.tsx` — table of past payments with date, amount, status

## Files to change

- `app/(publicGroup)/_components/payment/PricingSection.tsx`
- `app/(publicGroup)/_components/payment/SubscribeButton.tsx`
- `app/(publicGroup)/_actions/subscribePremium.ts`
- `app/(dashboardGroup)/_config/sidebarMenuItems.ts` — add subscription nav item for USER role

## Files to create

- `app/(dashboardGroup)/_actions/subscriptionActions.ts`
- `app/(dashboardGroup)/_components/SubscriptionStatusCard.tsx`
- `app/(dashboardGroup)/_components/BillingHistoryTable.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- Subscription status must be checked server-side — never trust client-side state alone
- Cancel subscription calls backend `POST /api/subscription/cancel` and revalidates subscription status cache
- Billing history fetched from `GET /api/subscription/billing-history` — handle empty state ("No billing history yet")
- Follow existing cookie-forwarding pattern for all server actions
- Subscription management pages go in `app/(dashboardGroup)/dashboard/subscription/` for USER, and similarly under author-dashboard and admin-dashboard if applicable
- Handle edge cases: user not logged in, subscription already cancelled, payment failed

## Definition of done

1. `/payment` shows pricing with subscribe button → clicking starts checkout and redirects to payment gateway
2. After successful payment, `/premium` is accessible (proxy.ts redirects unsubscribed users away)
3. Premium news page shows exclusive content with search
4. Dashboard has a subscription management page showing plan status, renewal date, and cancel option
5. Cancelling subscription updates the status and prevents access to `/premium`
6. Billing history shows past transactions with date, amount, and status
7. `npm run dev` works; `npx tsc --noEmit` passes
