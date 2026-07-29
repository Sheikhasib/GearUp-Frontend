# Spec: Role-Based Dashboards

## Overview

Build the three role-specific dashboard home pages and supporting pages. Each role (USER, AUTHOR, ADMIN) gets a tailored dashboard with relevant stats, shortcuts, and management tools. The sidebar navigation is already wired — this spec builds the page content behind it.

## Depends on

- `app/(dashboardGroup)/` layout — exists, fetches `getMe()`, renders `Navbar` + `DashboardSidebar`
- `app/(dashboardGroup)/_components/DashboardSidebar.tsx` — exists, role-aware sidebar
- `app/(dashboardGroup)/_config/sidebarMenuItems.ts` — exists, nav item configs per role
- `app/(dashboardGroup)/_actions/myPostsActions.ts` — exists (createPost, updatePost, getMyPosts)
- `app/(dashboardGroup)/_components/MyPostList.tsx`, `MyPostCard.tsx`, `PostFormDialog.tsx` — exist
- `proxy.ts` role-based access control — already routes `/dashboard`, `/author-dashboard`, `/admin-dashboard` by role

## Routes

- `/dashboard` — USER dashboard home (stub → real content)
- `/dashboard/my-posts` — USER post management (exists, functional)
- `/dashboard/profile` — USER profile view/edit (stub)
- `/author-dashboard` — AUTHOR dashboard home (stub)
- `/author-dashboard/my-posts` — AUTHOR post management (needs route + page)
- `/author-dashboard/profile` — AUTHOR profile view/edit (needs route + page)
- `/admin-dashboard` — ADMIN dashboard home (stub)
- `/admin-dashboard/my-posts` — ADMIN post management (needs route + page)
- `/admin-dashboard/users` — ADMIN user management (needs new route)
- `/admin-dashboard/profile` — ADMIN profile view/edit (needs route + page)

## Server actions

- `app/(dashboardGroup)/_actions/userActions.ts` — fetch user profile data, update profile
- `app/(dashboardGroup)/_actions/adminActions.ts` — fetch all users, manage user roles/status, fetch all posts for moderation

## Components

- **Create:** `app/(dashboardGroup)/_components/StatsCard.tsx` — metric display card (icon, label, value) used on dashboard homes
- **Create:** `app/(dashboardGroup)/_components/UserProfileForm.tsx` — profile edit form (name, email, profile photo, bio)
- **Create:** `app/(dashboardGroup)/_components/AdminUserTable.tsx` — table of users with role/status management
- **Create:** `app/(dashboardGroup)/_components/AdminPostTable.tsx` — table of all posts with status management (approve/archive)

## Files to change

- `app/(dashboardGroup)/dashboard/page.tsx` — build USER dashboard home with summary (post count, recent activity)
- `app/(dashboardGroup)/dashboard/profile/page.tsx` — wire up profile view/edit
- `app/(dashboardGroup)/author-dashboard/page.tsx` — build AUTHOR dashboard home with stats (total posts, views, recent comments)
- `app/(dashboardGroup)/admin-dashboard/page.tsx` — build ADMIN dashboard home with site-wide stats (total users, total posts, recent registrations)
- `app/(dashboardGroup)/_config/authorSidebarItems.ts` — add profile nav item
- `app/(dashboardGroup)/_config/adminSidebarItems.ts` — add users and profile nav items
- `app/(dashboardGroup)/_config/sidebarMenuItems.ts` — add new nav items to AUTHOR and ADMIN configs

## Files to create

- `app/(dashboardGroup)/_actions/userActions.ts`
- `app/(dashboardGroup)/_actions/adminActions.ts`
- `app/(dashboardGroup)/_components/StatsCard.tsx`
- `app/(dashboardGroup)/_components/UserProfileForm.tsx`
- `app/(dashboardGroup)/_components/AdminUserTable.tsx`
- `app/(dashboardGroup)/_components/AdminPostTable.tsx`
- `app/(dashboardGroup)/author-dashboard/my-posts/page.tsx`
- `app/(dashboardGroup)/author-dashboard/profile/page.tsx`
- `app/(dashboardGroup)/admin-dashboard/my-posts/page.tsx`
- `app/(dashboardGroup)/admin-dashboard/users/page.tsx`
- `app/(dashboardGroup)/admin-dashboard/profile/page.tsx`

## New dependencies

No new dependencies.

## Rules for implementation

- All dashboard pages must be behind `proxy.ts` role-based access control — verify the proxy config is correct
- Server actions for data fetching follow existing patterns:
  - Use `isAccessTokenExist()` from `service/refreshToken.ts` for token refresh
  - Forward cookies via `Cookie: accessToken=${accessToken}`
  - Use `revalidateTag()` for cache invalidation after mutations
  - Use `force-cache` + `next.tags` for reads where appropriate
- Dashboard home pages should show meaningful summary data fetched from backend endpoints
- My Posts pages for AUTHOR and ADMIN should reuse existing `MyPostsList`, `MyPostCard`, `PostFormDialog` components (co-located in `_components/`)
- Profile pages should use `getMe()` to load current data and `UserProfileForm` for edits
- Admin user management must follow role-based constraints — ADMIN cannot change their own role
- Handle loading state with existing `MyPostsSkeleton` pattern
- Handle empty states ("No posts yet", "No users found")
- Handle error states with user-friendly messages

## Definition of done

1. `/dashboard` shows USER stats: post count, recent activity
2. `/dashboard/my-posts` shows user's posts with create/edit (already functional — verify)
3. `/dashboard/profile` shows and editable user profile
4. `/author-dashboard` shows AUTHOR stats: total posts, total views, comment activity
5. `/author-dashboard/my-posts` shows author's posts with create/edit
6. `/admin-dashboard` shows site-wide stats: user count, post count, recent registrations
7. `/admin-dashboard/users` lists all users with role/status management
8. `/admin-dashboard/my-posts` lists all posts with status moderation
9. `npm run dev` works without errors; `npx tsc --noEmit` passes
