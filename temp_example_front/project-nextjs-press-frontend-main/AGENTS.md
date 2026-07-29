# AGENTS.md

## Next.js 16 quirks (this version differs from training data)

- **Middleware → Proxy**: File is `proxy.ts` at project root (not `middleware.ts`). Export a named `proxy` function (or default). Config via `export const config = { matcher: [...] }`.
- **`params` is a `Promise`**: Must `await params` in page/layout props (e.g. `const { id } = await params`).
- **Turbopack is default**: No `--turbopack` flag needed for `next dev` or `next build`.
- **ESLint is standalone**: Config is `eslint.config.mjs` (standard flat config), not in `next.config`.
- **Node.js 20.9+** required.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server on **port 5000** |
| `npm run build` | Production build |
| `npm run start` | Start prod server on port 5000 |
| `npm run lint` | ESLint (flat config) |

## Architecture

- **Route groups**: `app/(authGroup)/` — login/register, `app/(dashboardGroup)/` — role-based dashboards, `app/(publicGroup)/` — home/news/premium/payment. Each has its own layout that fetches `getMe()` and renders `<Navbar>`.
- **No test framework installed yet**. `vitest` is referenced in opencode subagent configs but not in `package.json`.
- **Server actions** (`"use server"`) are in `app/*/_actions/` directories, co-located with their route group.
- **Service layer** (`service/`): Server-only fetch helpers (`getMe`, `logout`, `refreshToken`) that forward httpOnly cookies to the backend.

## Auth flow

- JWT access + refresh tokens stored in **httpOnly cookies**. Verified client-side with `jsonwebtoken` (via `utils/jwt.ts`).
- `proxy.ts` handles token refresh, role-based redirects, and route protection.
- Three roles: `USER`, `AUTHOR`, `ADMIN` with separate dashboard routes.

## Config

- **shadcn/ui**: Radix-mira style, mauve base, lucide icons. Components in `components/ui/`.
- **Tailwind v4**: Uses `@import "tailwindcss"` + `@theme` directive syntax.
- **Path alias**: `@/*` maps to project root (not `src/`).
- **Env vars**: `BACKEND_API_URL` (server-only) and `NEXT_PUBLIC_BACKEND_API_URL` (client) — both default to `http://localhost:3000`.

## OpenCode agents

Custom subagents defined in `.opencode/agents/`:
- `test-feature` — run & analyze existing tests (read-only)
- `test-writter` — generate test cases from specs (has edit permission)
