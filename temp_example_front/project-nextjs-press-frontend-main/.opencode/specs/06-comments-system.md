# Spec: Comments System

## Overview

Add a comments system to news articles. Authenticated users can read and post comments on any news article. Authors and admins can moderate comments (approve, delete). Comment counts are already displayed on cards — this spec builds the full system behind them.

## Depends on

- `app/(publicGroup)/news/[id]/page.tsx` — exists as stub, target for comment UI
- `lib/types.ts` — IComment type exists with id, content, status, postId, authorId, timestamps
- `NewsCard.tsx` — already displays comment count from `post._count?.comments`
- Auth flow — only authenticated users can post comments
- `IPost` type includes `comments?: IComment[]` relation

## Routes

- `app/(publicGroup)/news/[id]/page.tsx` — detail page where comments are displayed and created

## Server actions

- **Create:** `app/(publicGroup)/_actions/commentActions.ts`
  - `getComments(postId)` — fetch comments for a post, support pagination
  - `createComment(postId, content)` — post a comment (authenticated users only)
  - `deleteComment(commentId)` — delete own comment or any comment (admin/author)
  - `moderateComment(commentId, status)` — approve/reject a comment (admin/author)

## Components

- **Create:** `app/(publicGroup)/_components/comments/CommentList.tsx` — displays paginated list of comments with author avatar, name, date, content
- **Create:** `app/(publicGroup)/_components/comments/CommentForm.tsx` — textarea + submit button for creating a new comment (requires auth; show login prompt if not logged in)
- **Create:** `app/(publicGroup)/_components/comments/CommentItem.tsx` — single comment with delete/edit options for the comment author
- **Create:** `app/(publicGroup)/_components/comments/CommentSkeleton.tsx` — loading skeleton for comments section

## Files to change

- `app/(publicGroup)/news/[id]/page.tsx` — add comments section below article content, wrapped in Suspense

## Files to create

- `app/(publicGroup)/_actions/commentActions.ts`
- `app/(publicGroup)/_components/comments/CommentList.tsx`
- `app/(publicGroup)/_components/comments/CommentForm.tsx`
- `app/(publicGroup)/_components/comments/CommentItem.tsx`
- `app/(publicGroup)/_components/comments/CommentSkeleton.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- Comment creation requires authentication — if no accessToken, show "Log in to comment" with a link to `/login?redirectTo=/news/[id]`
- Server action `createComment` must use `isAccessTokenExist()` from `service/refreshToken.ts` for token refresh
- Comments fetched with `force-cache` + `next.tags: ["comments", postId]` — revalidate on new comment
- Comment ordering: newest first, with pagination (10 per page)
- Comment status: PENDING (needs moderation), APPROVED, REJECTED
- Only APPROVED comments shown publicly; authors/admins see all statuses
- Delete button visible only for comment author and admin/author roles
- Handle empty state: "No comments yet. Be the first to share your thoughts."
- Handle loading state with CommentSkeleton
- Use existing shadcn/ui Avatar component for author avatars
- Follow existing cookie-forwarding pattern for all server actions

## Definition of done

1. News detail page shows a comments section below the article content
2. Authenticated users can write and submit a comment
3. Unauthenticated users see "Log in to comment" with a link to login
4. Comments show author name, avatar, timestamp, and content
5. Comment authors can delete their own comments
6. Admins/authors can moderate comments (approve/reject)
7. Comment count on news cards updates when new comments are added (via revalidateTag)
8. `npm run dev` works; `npx tsc --noEmit` passes
