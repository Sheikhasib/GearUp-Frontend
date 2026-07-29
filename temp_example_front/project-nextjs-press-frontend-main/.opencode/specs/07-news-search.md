# Spec: News Search

## Overview

Add a full search experience across public and premium news. The `NewsSearchBar` component already exists with debounced URL param updates. This spec wires it into the news listing pages, adds search results feedback, and integrates with the backend API.

## Depends on

- `app/(publicGroup)/_components/news/NewsSearchBar.tsx` — exists, debounced input updating URL searchParams with `searchTerm`
- `app/(publicGroup)/news/page.tsx` — news listing page, currently renders PublicNewsList (hardcoded mock)
- `app/(publicGroup)/premium/page.tsx` — premium page, already passes searchParams to PremiumNewsList
- `app/(publicGroup)/_actions/getPremiumNews.ts` — exists, reads `query.searchTerm` from params and sends to backend
- `app/(publicGroup)/_actions/getPublicNews.ts` — will be created in Spec 1, needs search support
- `app/(publicGroup)/_components/news/PublicNewsList.tsx` — currently uses mock data, needs searchParam support
- `app/(publicGroup)/_components/news/PremiumNewsList.tsx` — exists, already passes searchParams to getPremiumNews

## Routes

- `GET /news?searchTerm=...` — public news with search filter
- `GET /premium?searchTerm=...` — premium news with search filter (already works)

## Server actions

- **Modify:** `app/(publicGroup)/_actions/getPublicNews.ts` (from Spec 1) — accept `query.searchTerm` and pass to backend as URL param
- **Modify:** `app/(publicGroup)/_actions/getPremiumNews.ts` — already supports searchTerm; ensure it also supports additional filters like `sort`, `tag`, `page` if backend provides them

## Components

- **Modify:** `app/(publicGroup)/_components/news/NewsSearchBar.tsx` — add a clear/reset button when searchTerm is active; show an active filter indicator
- **Modify:** `app/(publicGroup)/news/page.tsx` — add `NewsSearchBar` and pass `searchParams` to `PublicNewsList`
- **Modify:** `app/(publicGroup)/_components/news/PublicNewsList.tsx` — accept `searchParams`, pass `searchTerm` to the server action; show "No results for '{query}'" when search returns empty
- **Modify:** `app/(publicGroup)/_components/news/PremiumNewsList.tsx` — add "No results for '{query}'" empty state when search is active
- **Create:** `app/(publicGroup)/_components/news/ActiveFilters.tsx` — chip/badge showing active search term with remove button

## Files to change

- `app/(publicGroup)/news/page.tsx`
- `app/(publicGroup)/_components/news/NewsSearchBar.tsx`
- `app/(publicGroup)/_components/news/PublicNewsList.tsx`
- `app/(publicGroup)/_components/news/PremiumNewsList.tsx`
- `app/(publicGroup)/_actions/getPublicNews.ts` (once created in Spec 1)
- `app/(publicGroup)/_actions/getPremiumNews.ts`

## Files to create

- `app/(publicGroup)/_components/news/ActiveFilters.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- Search input uses debounce (500ms) — already implemented in NewsSearchBar
- Empty search term removes the param from URL and shows all results
- Search results page shows the query in the heading ("Results for '...'") and a "Clear search" action
- Empty search results distinguish between "no news yet" (no query) and "no results for your search" (with query)
- ActiveFilters shows a removable chip with the current searchTerm — clicking X resets to all news
- Backend search API uses `?searchTerm=...` — already the pattern in getPremiumNews; ensure getPublicNews follows the same
- Loading state during search uses existing NewsSkeleton
- Both public and premium news support search with the same UX

## Definition of done

1. `/news` page has a search bar at the top that filters news as the user types (debounced)
2. Typing a search term updates the URL to `?searchTerm=...` and shows matching results
3. Empty search results show "No results for '{query}'" with a "Clear search" link
4. Active search shows a removable filter chip/badge
5. Clearing the search (via chip X or emptying the input) resets to full listing
6. `/premium` search works identically (already partially wired — verify)
7. `npm run dev` works; `npx tsc --noEmit` passes
