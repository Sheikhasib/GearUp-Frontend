# GearUp — Frontend

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

> Rent sports & outdoor gear instantly.

GearUp is a rental marketplace for sports and outdoor equipment. **Customers**
browse, book, and pay for gear by the day; **providers** list and fulfil their
own inventory; **admins** moderate the platform and manage users. One app, three
role-based experiences.

---

## Table of Contents

- [Live URLs](#live-urls)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Authentication & Route Guarding](#authentication--route-guarding)
- [Testing](#testing)
- [Documentation](#documentation)

## Live URLs

| Resource                | URL                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------- |
| **Frontend**            | <https://gear-up-frontend-hasib.vercel.app>                                             |
| **Backend API**         | <https://gearup-rental-api.vercel.app>                                                  |
| **Backend repository**  | <https://github.com/Sheikhasib/GearUp-Rent-Sports-Outdoor-Gear-Instantly--Backend-API-> |
| **Frontend repository** | <https://github.com/Sheikhasib/GearUp-Frontend>                                         |

## Key Features

| Role         | Capabilities                                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **Customer** | Browse & filter gear, place rental orders, pay via SSLCommerz, track orders, cancel while `PLACED`, leave reviews after return    |
| **Provider** | Manage own gear inventory (add / edit / delete with Cloudinary uploads), manage incoming orders through the full status lifecycle |
| **Admin**    | Platform statistics, manage users (suspend / activate), moderate all gear & orders, manage categories                             |

## Tech Stack

| Layer                 | Technology                                                                |
| --------------------- | ------------------------------------------------------------------------- |
| Framework             | Next.js 16 (App Router, Turbopack) with TypeScript                        |
| Styling               | Tailwind CSS v4, shadcn/ui, Radix UI, `next-themes` (dark mode)           |
| Data fetching / state | TanStack React Query + Zustand                                            |
| Forms                 | React Hook Form + Zod validation                                          |
| Authentication        | Cookie-based JWT, verified in middleware (`proxy.ts`) with `jsonwebtoken` |
| Images                | `next-cloudinary` upload widget                                           |
| Payments              | SSLCommerz (sandbox) redirect                                             |
| Testing               | Vitest + React Testing Library                                            |
| Tooling               | ESLint, Prettier, TypeScript                                              |

## Project Structure

```text
GearUp-Frontend
├── app/                              # Next.js App Router
│   ├── (authGroup)/                  # /login, /register
│   │   ├── _actions/                 # Server actions (auth schema + handlers)
│   │   ├── _components/              # Login / register forms
│   │   └── layout.tsx
│   ├── (publicGroup)/                # Public pages: home, gears, gear detail,
│   │   │                             # payment callbacks, about, contact,
│   │   │                             # profile (read-only account view)
│   │   ├── _actions/                 # Rental + payment status server actions
│   │   ├── _components/gear/         # GearCard, filters, grid, gallery, rent panel
│   │   ├── _hooks/                   # useGear
│   │   ├── _store/                   # rentSelectionStore (Zustand)
│   │   └── gears/[id]/               # Gear detail + reviews
│   ├── (dashboardGroup)/             # Role-scoped dashboards
│   │   ├── admin-dashboard/          # Overview, gear/order moderation, users, categories
│   │   ├── customer-dashboard/       # Orders, payments, order pay flow
│   │   ├── provider-dashboard/       # Inventory, gear CRUD, incoming orders
│   │   ├── _actions/                 # Payment, review server actions
│   │   ├── _components/              # admin / customer / provider tables & forms
│   │   ├── _config/                  # Sidebar menu items
│   │   ├── _hooks/                   # useAdmin, useProvider, useCustomerOrders...
│   │   └── layout.tsx
│   ├── providers/                    # QueryProvider
│   ├── layout.tsx                    # Root layout (fonts, providers, toaster)
│   └── globals.css
├── components/
│   ├── ui/                           # shadcn/ui primitives
│   └── shared/                       # navbar, pagination, error-fallback, card-field
├── hooks/                            # Generic hooks (use-mobile, useCategories)
├── lib/
│   ├── api/                          # Client API layer (client, gear, rentals,
│   │                                 # provider, admin, categories, payments)
│   ├── validations/                  # Zod schemas (gear, rental, review, category) + tests
│   ├── types.ts                      # Shared TypeScript types
│   └── utils.ts                      # cn() and helpers
├── service/                          # Server-side data fetching (getMe, refreshToken, logout)
├── store/                            # Zustand stores (authStore)
├── utils/                            # JWT helpers
├── proxy.ts                          # Next.js middleware — JWT verification + route guarding
├── public/                           # Static assets
├── docs/                             # Walkthrough & planning docs
├── package.json
└── next.config.ts
```

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- A running GearUp backend (local or the deployed instance) — see [Backend repository](https://github.com/Sheikhasib/GearUp-Rent-Sports-Outdoor-Gear-Instantly--Backend-API-)

### Installation

```bash
git clone https://github.com/Sheikhasib/GearUp-Frontend.git
cd GearUp-Frontend
npm install
```

### Configuration

Create your local environment file from the template and fill in the values:

```bash
cp .env.example .env.local
```

> The JWT secrets **must match the backend's** `JWT_ACCESS_SECRET` /
> `JWT_REFRESH_SECRET` exactly, or every token is rejected and dashboard routes
> redirect to `/login`. Point the API URLs at the deployed backend if you are
> not running one locally.

### Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

## Environment Variables

| Variable                            | Scope           | Description                                                                 |
| ----------------------------------- | --------------- | --------------------------------------------------------------------------- |
| `BACKEND_API_URL`                   | Server-only     | Base URL of the backend API (server components, server actions, middleware) |
| `NEXT_PUBLIC_BACKEND_API_URL`       | Client + server | Base URL of the backend API for public client-side calls                    |
| `JWT_ACCESS_SECRET`                 | Server-only     | Secret used to verify access tokens; must match backend                     |
| `JWT_REFRESH_SECRET`                | Server-only     | Secret used to verify refresh tokens; must match backend                    |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Client          | Cloudinary cloud name for gear image uploads                                |

## Available Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start the development server       |
| `npm run build`      | Create a production build          |
| `npm run start`      | Serve the production build         |
| `npm run lint`       | Run ESLint                         |
| `npm run typecheck`  | Run the TypeScript type checker    |
| `npm run format`     | Format code with Prettier          |
| `npm run test`       | Run the Vitest suite once          |
| `npm run test:watch` | Run the Vitest suite in watch mode |

## Authentication & Route Guarding

Auth is handled entirely server-side in `proxy.ts` (Next.js middleware):

1. Reads the `accessToken` / `refreshToken` httpOnly cookies.
2. Verifies the access token with `JWT_ACCESS_SECRET`; if expired but the
   refresh token is valid, it calls `POST /api/auth/refresh-token` and re-sets
   the access cookie.
3. Guards routes:
   - Logged-in users visiting `/login` / `/register` → redirected to their role dashboard.
   - Unauthenticated users on protected routes → `/login?redirectTo=...`.
   - Role mismatch (e.g. a CUSTOMER opening `/admin-dashboard`) → `/not-found`.
4. `/payment/success` and `/payment/cancel` verify the real payment status server-side before rendering.

### Seeded Admin Account

| Role  | Email              | Password    |
| ----- | ------------------ | ----------- |
| Admin | `admin@gearup.com` | `Admin123!` |

> Customers and providers self-register from the `/register` page by selecting a role.

## Testing

The project uses **Vitest** with React Testing Library (jsdom). Tests currently
cover the rental date-overlap validation logic:

```bash
npm run test
```

## Documentation

- **API integration** — see [`API_INTEGRATION.md`](./API_INTEGRATION.md)
- **Project walkthrough** — see [`docs/PROJECT_WALKTHROUGH.md`](./docs/PROJECT_WALKTHROUGH.md)

---

Built with Next.js, TypeScript, and Tailwind CSS.
