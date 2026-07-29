# Spec: News Listing & Detail Pages

## Overview

Build the public news browsing experience. Users can view a paginated list of published news articles, search/filter by keyword, and click through to a full detail page. Premium articles should be visually distinguished (content is gated behind subscription — handled separately).

## Depends on

- `app/(publicGroup)/news/page.tsx` — exists, wired with Suspense + `PublicNewsList`
- `app/(publicGroup)/news/[id]/page.tsx` — exists as stub
- `app/(publicGroup)/_components/news/` — NewsCard, NewsSearchBar, NewsSkeleton, PublicNewsList (hardcoded mock data)
- `lib/types.ts` — IPost, IAuthor types
- Auth pattern in `service/` + `_actions/` for cookie-forwarding

## Routes

- `GET /news` — public news listing page (exists, needs real data)
- `GET /news/[id]` — news detail page (exists as stub)

## Server actions

- `app/(publicGroup)/_actions/getPublicNews.ts` — fetch paginated public posts from `GET /api/posts?page=&searchTerm=`. Forward accessToken cookie. Support `cache: "force-cache"` with tag `["public-posts"]`.

## Components

- **Modify:** `app/(publicGroup)/_components/news/PublicNewsList.tsx` — replace mock data with server action call; add pagination controls
- **Modify:** `app/(publicGroup)/_components/news/NewsCard.tsx` — wrap with `<Link href="/news/[id]">` to make the card clickable to the detail page
- **Modify:** `app/(publicGroup)/news/page.tsx` — pass searchParams to PublicNewsList for search/filter
- **Create:** `app/(publicGroup)/_components/news/NewsDetail.tsx` — full article view: title, author, date, tags, thumbnail, content body, comment count, premium badge
- **Create:** `app/(publicGroup)/_components/news/Pagination.tsx` — page navigation (prev/next or numbered)

## Files to change

- `app/(publicGroup)/news/page.tsx`
- `app/(publicGroup)/news/[id]/page.tsx`
- `app/(publicGroup)/_components/news/PublicNewsList.tsx`
- `app/(publicGroup)/_components/news/NewsCard.tsx`

## Files to create

- `app/(publicGroup)/_actions/getPublicNews.ts`
- `app/(publicGroup)/_components/news/NewsDetail.tsx`
- `app/(publicGroup)/_components/news/Pagination.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- Use server action pattern (`"use server"`) for `getPublicNews` — co-located in `_actions/`
- Fetch must forward `accessToken` via cookie header (follow existing pattern in `getPremiumNews.ts`)
- Use `IPost` type from `lib/types.ts` for all data shapes
- `NewsCard` should link to `/news/[id]` using Next.js `<Link>` — keep the existing card layout
- Detail page must await `params` (`params: Promise<{ id: string }>`)
- Handle loading state via existing `NewsSkeleton` and Suspense
- Handle empty state ("No news found.") — already partially implemented
- Handle error state — wrap detail page fetch in try/catch, show error message
- Pagination defaults: page 1, 9 items per page (3 columns × 3 rows)
- Search via `NewsSearchBar` updates URL search params, consumed by `PublicNewsList`

## Definition of done

1. `GET /news` shows a grid of published news cards fetched from the backend
2. Cards display: thumbnail, title, tags, premium badge, author name, date, comment count
3. Clicking a card navigates to `/news/[id]` with the full article content
4. News detail page shows: title, author, published date, tags, thumbnail, full content
5. Search bar filters news by keyword via URL search params
6. Pagination controls appear when there are more than 9 articles
7. `npm run dev` works without errors; `npx tsc --noEmit` passes
