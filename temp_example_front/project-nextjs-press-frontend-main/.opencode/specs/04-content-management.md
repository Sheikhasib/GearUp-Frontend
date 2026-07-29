# Spec: Content Management

## Overview

Give authors and admins full CRUD content management tools beyond the existing create/edit dialog. Add post deletion, post status management (DRAFT / PUBLISHED / ARCHIVED), admin moderation of all posts, and a richer editing experience.

## Depends on

- `app/(dashboardGroup)/_actions/myPostsActions.ts` — createPost, updatePost, getMyPosts exist
- `app/(dashboardGroup)/_components/PostFormDialog.tsx` — create/edit dialog exists
- `app/(dashboardGroup)/_components/MyPostList.tsx` — lists posts from getMyPosts
- `app/(dashboardGroup)/_components/MyPostCard.tsx` — card with status badge, edit button
- `app/(dashboardGroup)/_components/MyPostSkeleton.tsx` — loading state
- `lib/types.ts` — IPost includes status field (DRAFT | PUBLISHED | ARCHIVED)

## Routes

All under `app/(dashboardGroup)/` — already routed via existing dashboard layout + sidebar

## Server actions

- **Modify:** `app/(dashboardGroup)/_actions/myPostsActions.ts` — add `deletePost(postId)` action; add `updatePostStatus(postId, status)` action for publish/archive/draft toggle
- **Create:** `app/(dashboardGroup)/_actions/adminActions.ts` — `getAllPosts(query?)` to fetch all posts for admin moderation; `moderatePost(postId, status)` to approve/reject/archive

## Components

- **Modify:** `app/(dashboardGroup)/_components/MyPostCard.tsx` — add delete button with confirmation dialog; add status change dropdown (DRAFT → PUBLISHED, PUBLISHED → ARCHIVED, etc.)
- **Modify:** `app/(dashboardGroup)/_components/PostFormDialog.tsx` — add status field (DRAFT/PUBLISHED) on create; show archived badge (read-only) on archived posts
- **Create:** `app/(dashboardGroup)/_components/ConfirmDeleteDialog.tsx` — reuse existing shadcn Dialog with destructive styling for delete confirmation
- **Create:** `app/(dashboardGroup)/_components/AdminModerationList.tsx` — table/card list of all posts with approve/reject/archive actions
- **Create:** `app/(dashboardGroup)/_components/PostStatusBadge.tsx` — reusable badge for DRAFT/PUBLISHED/ARCHIVED with distinct colors

## Files to change

- `app/(dashboardGroup)/_actions/myPostsActions.ts`
- `app/(dashboardGroup)/_components/MyPostCard.tsx`
- `app/(dashboardGroup)/_components/PostFormDialog.tsx`

## Files to create

- `app/(dashboardGroup)/_actions/adminActions.ts`
- `app/(dashboardGroup)/_components/ConfirmDeleteDialog.tsx`
- `app/(dashboardGroup)/_components/AdminModerationList.tsx`
- `app/(dashboardGroup)/_components/PostStatusBadge.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- Delete must use a confirmation dialog with destructive styling (red button, warning text)
- Status transitions: DRAFT ↔ PUBLISHED, PUBLISHED → ARCHIVED (no direct DRAFT → ARCHIVED)
- Admin moderation actions revalidate both `"my-posts"` and `"public-posts"` / `"premium-posts"` tags
- Follow existing server action pattern: `isAccessTokenExist()` for token refresh, cookie forwarding, `revalidateTag()`
- Status badges: DRAFT → yellow/amber, PUBLISHED → green, ARCHIVED → gray
- Deleted posts should show a success toast and remove the card from the list (revalidate or client-side remove)

## Definition of done

1. My Post card shows a delete button → clicking opens a confirmation dialog → confirming deletes the post from the backend and removes it from the list
2. Author/User can change post status between DRAFT and PUBLISHED from the card
3. Archived posts show as read-only (no edit, status badge gray)
4. Admin dashboard has a moderation page listing all posts with approve/reject/archive actions
5. Server actions handle errors gracefully with toast feedback
6. `npm run dev` works; `npx tsc --noEmit` passes
