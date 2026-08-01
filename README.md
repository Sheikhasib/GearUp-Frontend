# GearUp — Frontend

**Rent Sports & Outdoor Gear Instantly.**

GearUp is a rental marketplace where customers rent sports and outdoor equipment
by the day, providers list and fulfil gear, and admins moderate the platform.

## Live URL

- **Frontend:** https://gear-up-frontend-hasib.vercel.app
- **Backend API:** https://gearup-rental-api.vercel.app
- **Backend repo:** https://github.com/Sheikhasib/GearUp-Rent-Sports-Outdoor-Gear-Instantly--Backend-API-

## Tech Stack

- **Next.js 16** (App Router, Turbopack) with TypeScript
- **Tailwind CSS v4** + **shadcn/ui** + **Radix UI**
- **React Query** for client data fetching, **Zustand** for state
- **next-cloudinary** for gear image uploads
- **jsonwebtoken** for cookie-based auth verification in middleware
- **SSLCommerz** (sandbox) for payment redirects

## Admin Credentials (seeded)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@gearup.com` | `Admin123!` |

> Customers and providers self-register from the `/register` page by picking a role.

## Local Development

1. Clone the repo:

   ```bash
   git clone https://github.com/Sheikhasib/GearUp-Frontend.git
   cd GearUp-Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` from the template (copy `.env.example`) and fill in values:

   ```bash
   cp .env.example .env.local
   ```

   The backend API must be running locally (or point the URLs at the deployed
   backend) and the JWT secrets must match the backend's exactly.

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run format` | Prettier format |

## Documentation

- **API integration:** see [`API_INTEGRATION.md`](./API_INTEGRATION.md)
- **Project walkthrough / examiner tour:** see [`docs/PROJECT_WALKTHROUGH.md`](./docs/PROJECT_WALKTHROUGH.md)

## Roles & Features

| Role | What they can do |
|------|------------------|
| **Customer** | Browse & filter gear, place rental orders, pay via SSLCommerz, track orders, cancel (while PLACED), leave reviews after return |
| **Provider** | Manage own gear inventory (add/edit/delete with Cloudinary uploads), manage incoming orders through the full status lifecycle |
| **Admin** | Platform stats, manage users (suspend/activate), moderate all gear & orders, manage categories |
