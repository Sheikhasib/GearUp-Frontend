# Prisma Press Backend

## Quick start

```bash
cp .env.example .env        # edit with real values
npm install
npx prisma migrate dev      # applies pending migrations
npm run dev                 # tsx watch src/server.ts
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with hot-reload |
| `npm run build` | `tsc` → `dist/` |
| `npm start` | Run compiled `dist/server.js` |
| `npm run stripe:webhook` | Proxy Stripe events to local webhook |
| `npx prisma migrate dev` | Apply pending migrations |
| `npx prisma generate` | Regenerate client from schema |

No lint, format, type-check, or test commands exist.

## Architecture

- **Express v5** + **Prisma v7** (PostgreSQL via `@prisma/adapter-pg`)
- **ESM** (`"type": "module"`), target ES2023, moduleResolution bundler
- **MVC modules**: `*.route.ts` → `*.controller.ts` → `*.service.ts`, typed via `*.interface.ts`
- No validation library — use inline checks in services
- No DI container — singletons imported directly (prisma, stripe, config)

## Prisma specifics

- Schema is **multi-file** under `prisma/schema/`; root `prisma.config.ts` sets `schema: "prisma/schema"`
- Generated client output: `../../generated/prisma` (custom path, not `node_modules/.prisma`)
- Imports come from `../../generated/prisma/client` and `../../generated/prisma/enums`
- `generated/` and `dist/` are gitignored — run `npx prisma generate` after clone

## API conventions

- **Base**: `/api/users`, `/api/auth`, `/api/posts`, `/api/comments`, `/api/subscription`, `/api/premium`
- **Response shape**: uses `sendResponse(res, { success, statusCode, message, data, meta })`
- **Error handling**: `catchAsync` wrapper → `globalErrorHandler` (handles Prisma errors: P2002→409, P2025→404, P1000→401)
- **Auth middleware**: reads `req.cookies.accesstoken` first, then `Authorization: Bearer <token>` header. Pass roles: `auth(Role.ADMIN)` or `auth()` (any authenticated)
- **Premium guard**: `subscriptionGuard()` — checks active subscription after auth
- **Roles**: `USER`, `ADMIN`, `AUTHOR` (imported from generated enums)
- **Pagination**: meta object with `{ page, limit, total, totalPages }` returned with list endpoints
- `req.user` augmentation: `src/middleware/index.d.ts` declares `{ id, name, email, role }`

## Stripe webhooks

- Webhook route **must** use `express.raw()` **before** `express.json()`: `/api/subscription/webhook` is already configured with raw body parsing (line 82 of `app.ts`)
- `subscription.utils.ts` handles `checkout.session.completed` and `customer.subscription.*` events

## Notable absences

- No test framework, no CI/CD, no Docker, no lint, no formatter
- No README
