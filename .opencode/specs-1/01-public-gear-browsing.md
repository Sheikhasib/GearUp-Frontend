# Spec: Public Gear Browsing & Detail

## Overview

Build the public gear browsing experience. Customers can view a grid of available gear with images, filter by category/price/brand, search by keyword, and click through to a full detail page with rental CTA.

## Depends on

- `lib/types.ts` — IGearItem, ICategory, IGearQuery types
- `lib/api/client.ts` — base fetch client (client-side, for TanStack Query)
- `lib/api/gear.ts` — fetchGear, fetchGearById
- `lib/api/categories.ts` — fetchCategories
- `hooks/useGear.ts` — useQuery hooks for gear
- `hooks/useCategories.ts` — useQuery hook for categories
- `next.config.ts` — remotePatterns for res.cloudinary.com, images.unsplash.com
- `app/(publicGroup)/` — route group must exist

## Routes

- `GET /` — home page with hero + featured gear grid
- `GET /gear` — browse & filter all gear
- `GET /gear/[id]` — gear detail page

## Components

- **Create:** `app/(publicGroup)/_components/GearCard.tsx` — card with image, name, price/day, brand, availability badge; motion stagger on mount; cursor-pointer; links to `/gear/[id]`
- **Create:** `app/(publicGroup)/_components/GearGrid.tsx` — responsive grid (1 col mobile, 2 tablet, 3 desktop) with StaggeredGrid animation wrapper
- **Create:** `app/(publicGroup)/_components/GearFilters.tsx` — sidebar/top-bar: category dropdown, price range inputs, brand input; updates URL search params
- **Create:** `app/(publicGroup)/_components/GearSkeleton.tsx` — skeleton card for loading state
- **Create:** `app/(publicGroup)/_components/GearGallery.tsx` — image gallery with AnimatePresence for main image swap
- **Create:** `app/(publicGroup)/_components/GearDetail.tsx` — full detail: gallery, name, brand, description, price, provider info, availability, "Rent Now" CTA with date picker
- **Create:** `app/(publicGroup)/_components/FeaturedGear.tsx` — featured gear section for home page (first 6 items, horizontal scroll or grid)

## Files to change

- `app/page.tsx` — replace demo content with Hero + FeaturedGear
- `app/(publicGroup)/gear/page.tsx` — create if not exists
- `app/(publicGroup)/gear/[id]/page.tsx` — create if not exists

## Files to create

- `app/(publicGroup)/_components/GearCard.tsx`
- `app/(publicGroup)/_components/GearGrid.tsx`
- `app/(publicGroup)/_components/GearFilters.tsx`
- `app/(publicGroup)/_components/GearSkeleton.tsx`
- `app/(publicGroup)/_components/GearGallery.tsx`
- `app/(publicGroup)/_components/GearDetail.tsx`
- `app/(publicGroup)/_components/FeaturedGear.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- Use client components with TanStack Query (`useGear`, `useCategories` hooks)
- GearCard must use `next/image` with `fill` + `sizes` prop + `onError` fallback to placeholder icon
- All cards must have `cursor-pointer` and hover lift via `motion.div whileHover={{ y: -4 }}`
- Stagger animation on grid: `staggerChildren: 0.08`
- Gear detail page must await `params` (`params: Promise<{ id: string }>`)
- Filters update URL search params, consumed by `useGear` query
- Handle loading: GearSkeleton grid
- Handle empty: "No gear found." with clear CTA to reset filters
- Handle error: error message with retry button
- Price displayed as "$X / day"

## Definition of done

1. `/` shows hero section + featured gear grid with motion animation
2. `/gear` shows paginated gear grid with category/price/brand filters
3. `/gear/[id]` shows full gear detail with image gallery, specs, provider info
4. Filters persist in URL search params
5. Cards link to detail page
6. `npm run dev` works without errors; `npx tsc --noEmit` passes
