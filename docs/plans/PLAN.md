# GearUp Frontend — Plan

## §11 Mandatory-Requirements Checklist

Final verification pass against the assignment requirements
(`2-GearUp-Frontend.md`) and Spec 07 (`error-handling-and-polish`).
Checked only after confirming the behaviour in the running app.

### Roles, Auth & Route Protection

- [x] Registration with role selection (CUSTOMER / PROVIDER / ADMIN)
- [x] Login with email + password
- [x] Zod validation with human-readable inline messages on auth forms
- [x] Success/failure `sonner` toasts on register and login
- [x] Protected role-based dashboard routes (server-side `getMe()` guard +
      client role checks in navbar/sidebar)
- [x] UI adapts dynamically to the authenticated user's role

### Public Features

- [x] Home page with hero + featured gear
- [x] Responsive gear grid: optimized images, price per day, category,
      availability status
- [x] Advanced search & filters: search term, category, brand, price range,
      availability dates (URL-driven, real-time updates)
- [x] Gear details page: image gallery, specs, provider info, "Rent Now" panel
      with date picker (past/unavailable dates blocked)
- [x] Skeleton `loading.tsx` for every server-fetching route (root, gears,
      gear detail, reviews, dashboard group, payment success/cancel, pay page)
- [x] `error.tsx` at root, dashboard group and gears — friendly message +
      "Try again" + "Go home" link
- [x] `not-found.tsx` at root and `gears/[id]`

### Customer Features

- [x] Interactive checkout: select rental dates + quantity, place order with
      success/failure toast
- [x] Payment initiation via SSLCommerz redirect with dedicated
      `/payment/success` and `/payment/cancel` pages; failure surfaces the
      real error inline
- [x] Order history with status badges + cancellation (PLACED only)
- [x] Payment history table
- [x] Review form after the gear is returned (success/failure toast, single
      review per order)

### Provider Features

- [x] Dashboard overview: total gear listed, active rentals, pending orders
- [x] Inventory management: add / edit / delete gear (image URL, pricing,
      stock/availability) with toasts on success and failure
- [x] Order management: Confirm / Mark Picked Up / Mark Returned / Cancel with
      optimistic UI + toasts

### Admin Features

- [x] Global platform stats: total users, active gear, total rentals
- [x] User management: search, pagination, suspend/activate actions with toasts
- [x] Content moderation: all gear listings + all rental orders
- [x] Category manager: add / edit / delete (delete guarded while category is
      in use)

### Error Handling & Polish (Spec 07)

- [x] Every mutation toasts success AND failure: register, login, gear CRUD,
      order status change, payment init, review, admin suspend/activate,
      cancel rental, logout
- [x] Every form's Zod schema emits a human-readable message per field
- [x] Mobile pass: gear grid responsive; all 8 dashboard tables convert to
      stacked cards under `sm`; dashboard nav uses a drawer on mobile; rent-now
      date picker shows one month on small screens
- [x] Status badges have dark-mode variants
- [x] Dark/light mode via `next-themes` with `class` strategy
- [x] `npm run typecheck` passes
- [x] `eslint` passes (warnings only, all pre-existing)
- [x] `next build` passes

## §12 Deployment & Submission (Spec 08)

- [x] `next.config.ts` remote images whitelist trimmed to `res.cloudinary.com`
- [x] `.env.example` committed with placeholders; `.env` stays untracked
- [x] `README.md` rewritten: live URL, backend repo link, seeded admin
      credentials (`admin@gearup.com` / `Admin123!`), local setup instructions
- [x] `API_INTEGRATION.md` created from the actual endpoint inventory
- [x] Commit count ≥ 20 with conventional prefixes (35 + DoD commits)
- [x] Frontend deployed on Vercel with all 5 env vars
- [ ] Backend env confirmed: `FRONTEND_URL` = deployed frontend,
      `BACKEND_PUBLIC_URL` includes `https://` scheme
- [ ] SSLCommerz sandbox loop tested against deployed URLs (not localhost)
- [ ] Admin credentials verified on the deployed URL
- [ ] Video / examiner walkthrough recorded — outline in
      `docs/PROJECT_WALKTHROUGH.md`
- [ ] `docs/plans/08-deployment-and-submission.md` reflects the final state
