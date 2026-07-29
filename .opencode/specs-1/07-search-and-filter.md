# Spec: Search & Filter

## Overview

Build a robust search and filter system for the gear browsing page. Users can search by keyword, filter by category, price range, and brand, with real-time URL-based state that persists across navigation.

## Depends on

- `lib/types.ts` — IGearQuery type
- `lib/api/gear.ts` — fetchGear(query) — already supports all filter params
- `hooks/useGear.ts` — useGear(query) — already supports query filters
- `hooks/useCategories.ts` — useCategories() for category dropdown
- `app/(publicGroup)/` — route group
- `app/(publicGroup)/gear/page.tsx` — must exist (or create)

## Routes

- `GET /gear?searchTerm=&categoryId=&minPrice=&maxPrice=&brand=&page=` — browsable, shareable URLs

## Components

**Create:**
- `app/(publicGroup)/_components/SearchBar.tsx` — text input with search icon, debounced (300ms), updates URL search params
- `app/(publicGroup)/_components/FilterSidebar.tsx` — slide-over sidebar on mobile, inline panel on desktop: category checkboxes, price range (min/max inputs), brand input, clear all button
- `app/(publicGroup)/_components/ActiveFilters.tsx` — horizontal pill row showing active filters with X to remove each
- `app/(publicGroup)/_components/Pagination.tsx` — page number buttons with prev/next, updates URL param

**Modify:**
- `app/(publicGroup)/_components/GearGrid.tsx` — accept filters as props, pass to useGear hook

## Files to change

- `app/(publicGroup)/gear/page.tsx` — read searchParams, pass to filter components and GearGrid
- `app/(publicGroup)/_components/GearGrid.tsx` — accept query filters

## Files to create

- `app/(publicGroup)/_components/SearchBar.tsx`
- `app/(publicGroup)/_components/FilterSidebar.tsx`
- `app/(publicGroup)/_components/ActiveFilters.tsx`
- `app/(publicGroup)/_components/Pagination.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- All filter state lives in URL search params (`useSearchParams` + `useRouter.push`) — not in React state
- SearchBar debounces input 300ms before updating URL
- Filter changes immediately update URL params (no apply button needed)
- ActiveFilters shows removable pill for each active filter (category name, price range, brand, search term)
- Pagination reads `meta` from `IApiResponse` (page, limit, total, totalPages)
- Desktop: filters in left sidebar. Mobile: filters in sheet/drawer (use shadcn Sheet)
- Clear All button resets all params
- Empty state: "No gear matches your filters" with "Clear filters" CTA
- Skeleton grid while loading
- Motion: Filter panel slides in on mobile (`AnimatePresence`), pills animate in/out

## Definition of done

1. `/gear?searchTerm=kayak` shows only kayak results
2. Category + price + brand filters work together (AND logic)
3. Active filter pills show and can be individually removed
4. Pagination controls appear when results exceed page size
5. Filter state persists in URL (shareable/bookmarkable)
6. Mobile filters open in a slide-over sheet
7. `npm run dev` works without errors; `npx tsc --noEmit` passes
