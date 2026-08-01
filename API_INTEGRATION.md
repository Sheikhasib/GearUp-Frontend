# GearUp — Frontend ↔ Backend API Integration

How the frontend talks to the GearUp backend API. All requests hit
`{API_BASE}/api/...` where `API_BASE` is:

- `process.env.BACKEND_API_URL` for **server-side** code (server components,
  server actions, the proxy middleware).
- `process.env.NEXT_PUBLIC_BACKEND_API_URL` for **client-side** code
  (`lib/api/client.ts`).

Both are the same base URL. Authentication is cookie-based (`accessToken` /
`refreshToken`, httpOnly); client requests send `credentials: "include"` and the
middleware (`proxy.ts`) verifies the access token with `JWT_ACCESS_SECRET` and
silently refreshes it via `POST /api/auth/refresh-token` when expired.

## Response envelope

Every endpoint returns:

```json
{
  "success": true,
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 100, "totalPage": 10 },
  "message": "optional message"
}
```

Pagination meta is present on list endpoints (gear, reviews, dashboards).

## Endpoint inventory

### Auth

| Method | Path | Auth | Purpose | Source |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register with role (CUSTOMER / PROVIDER / ADMIN) | `app/(authGroup)/_actions/authActions.ts` |
| `POST` | `/api/auth/login` | Public | Login, sets access/refresh cookies | `app/(authGroup)/_actions/authActions.ts` |
| `POST` | `/api/auth/refresh-token` | Refresh cookie | Rotate access token | `service/refreshToken.ts` |
| `GET` | `/api/auth/me` | Access token | Current user (role guard for dashboards) | `service/getMe.ts` |

### Public gear & reviews

| Method | Path | Auth | Purpose | Source |
|---|---|---|---|---|
| `GET` | `/api/gear` | Public | List/search/filter gear (see query params below) | `lib/api/gear.ts` |
| `GET` | `/api/gear/:id` | Public | Single gear detail | `lib/api/gear.ts`, `app/(publicGroup)/_actions/gear/rentalActions.ts` |
| `GET` | `/api/gear/:id/reviews` | Public | Paginated reviews (`?page=&limit=`) | `service/fetchGearReviewsServer.ts` |
| `GET` | `/api/categories` | Public | All categories | `lib/api/categories.ts` |

`GET /api/gear` query params: `searchTerm`, `categoryId`, `brand`, `minPrice`,
`maxPrice`, `availableFrom`, `availableTo`, `page`, `limit`, `sortBy`, `sortOrder`.

### Customer — rentals & payments

| Method | Path | Auth | Purpose | Source |
|---|---|---|---|---|
| `POST` | `/api/rentals` | Customer | Place a rental order | `lib/api/rentals.ts` |
| `GET` | `/api/rentals` | Customer | My orders | `lib/api/rentals.ts` |
| `GET` | `/api/rentals/:id` | Customer | Single order (pay page) | `lib/api/rentals.ts`, `service/fetchRentalOrderServer.ts` |
| `PATCH` | `/api/rentals/cancel/:id` | Customer | Cancel (PLACED only) | `lib/api/rentals.ts` |
| `POST` | `/api/payments/create` | Customer | Initiate SSLCommerz redirect; returns `{ paymentUrl }` | `lib/api/payments.ts`, `app/(dashboardGroup)/_actions/payment/createPaymentAction.ts` |
| `GET` | `/api/payments/customer` | Customer | My payment history | `lib/api/payments.ts` |
| `GET` | `/api/payments/status/:orderId` | Customer | Poll payment status (success/cancel guard) | `app/(publicGroup)/_actions/payment/getPaymentStatus.ts` |
| `POST` | `/api/reviews` | Customer | Submit review after return (one per order) | `app/(dashboardGroup)/_actions/reviewActions.ts` |

### Provider

| Method | Path | Auth | Purpose | Source |
|---|---|---|---|---|
| `POST` | `/api/provider/gear` | Provider | Create gear listing | `lib/api/provider.ts` |
| `GET` | `/api/provider/my-gear` | Provider | My inventory | `lib/api/provider.ts` |
| `PATCH` | `/api/provider/gear/:id` | Provider | Update gear | `lib/api/provider.ts` |
| `DELETE` | `/api/provider/gear/:id` | Provider | Delete gear | `lib/api/provider.ts` |
| `GET` | `/api/provider/rentalOrders` | Provider | Incoming orders | `lib/api/provider.ts` |
| `PATCH` | `/api/provider/rentalOrders/:id` | Provider | Advance order status (`{ status }`) | `lib/api/provider.ts` |

### Admin

| Method | Path | Auth | Purpose | Source |
|---|---|---|---|---|
| `GET` | `/api/admin/users` | Admin | All users (optional `?role=`) | `lib/api/admin.ts` |
| `PATCH` | `/api/admin/users/:id` | Admin | Suspend/activate user (`{ status }`) | `lib/api/admin.ts` |
| `GET` | `/api/admin/gear` | Admin | All gear listings | `lib/api/admin.ts` |
| `GET` | `/api/admin/rentalOrders` | Admin | All rental orders | `lib/api/admin.ts` |
| `POST` | `/api/categories` | Admin | Create category (`{ name }`) | `lib/api/categories.ts` |
| `PATCH` | `/api/categories/:id` | Admin | Rename category (`{ name }`) | `lib/api/categories.ts` |
| `DELETE` | `/api/categories/:id` | Admin | Delete category (blocked while in use) | `lib/api/categories.ts` |

## Shared client

`lib/api/client.ts` exports `apiClient<T>()` (returns `data`) and
`apiClientFull<T>()` (returns the whole envelope) — all feature modules in
`lib/api/` build on these. Any non-`2xx` or `success: false` response throws an
`ApiError` surfaced to the UI via toasts.
