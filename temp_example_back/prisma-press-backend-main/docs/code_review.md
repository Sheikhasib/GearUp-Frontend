# Code Review Report — Prisma Press Backend

**Date:** 2026-07-12
**Scope:** Full source audit (`src/`, `prisma/`, config files)
**Severity:** 🔴 Critical · 🟠 Major · 🟡 Minor · ⚪ Suggestion

---

## 🔴 Critical Bugs

### CRIT-1: `getCommentsByPostId` queries by comment `id` instead of `postId`

**File:** `src/modules/comment/comment.service.ts:69`
```ts
const comment = await prisma.comment.findMany({
  where: {
    id: postId,       // ❌ should be: postId: postId (or shorthand { postId })
  },
});
```

The route `GET /:postId` is intended to return all comments under a post, but the query filters the **comment's own `id`** instead of the `postId` foreign key. This route always returns zero results or the wrong comment.

**Fix:** Change to `where: { postId }`.

---

### CRIT-2: Global error handler always returns HTTP 500

**File:** `src/middleware/globalErrorHandler.ts:50`
```ts
res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ ... });
```

The handler computes the correct `statusCode` (409 for P2002, 404 for P2025, 401 for P1000, etc.) and puts it in the JSON body, but **always sends HTTP 500** on the wire. Clients see a 500 status in the HTTP response despite getting a different `statusCode` in the body.

**Fix:** Use `res.status(statusCode || httpStatus.INTERNAL_SERVER_ERROR)` at line 50.

---

### CRIT-3: `premiumGuard` does not check subscription expiry date

**File:** `src/middleware/premiumGuard.ts:22-24`
```ts
if (subscription?.status !== SubscriptionStatus.ACTIVE) {
  throw new Error("Please subscribe again...");
}
```

The guard only checks `status !== ACTIVE`, but does **not** check whether `currentPeriodEnd` has passed. A subscription row could have `status = ACTIVE` while `currentPeriodEnd` is in the past (e.g. if Stripe's webhook marking it expired hasn't arrived yet, or if a manual DB update occurred). Meanwhile `getSubscriptionStatus` in `subscription.service.ts:110-113` *does* check the date:

```ts
const isActive =
  isSubscriptionExists?.status === "ACTIVE" &&
  isSubscriptionExists?.currentPeriodEnd &&
  new Date(isSubscriptionExists.currentPeriodEnd) > new Date();
```

**Fix:** Add the `currentPeriodEnd` check to `premiumGuard` so it matches the logic in `getSubscriptionStatus`.

---

### CRIT-4: `ICreateCommentPayload` requires `id` field that should be auto-generated

**File:** `src/modules/comment/comment.interface.ts:4`
```ts
export interface ICreateCommentPayload {
  id: string;          // ❌ Should NOT be required — Prisma auto-generates with @default(uuid())
  content: string;
  authorId: string;
  postId: string;
  status?: CommentStatus;
}
```

Clients are expected to send an `id` value, but the schema defines `id @id @default(uuid())`. If clients omit `id`, TypeScript will error, but Prisma will generate one anyway. If clients *do* send an `id` that collides, the insert will fail.

**Fix:** Remove `id` from `ICreateCommentPayload`.

---

## 🟠 Major Issues

### MAJ-1: `globalErrorHandler` response statusCode column doesn't match HTTP status — breaks client expectations

(Related to CRIT-2) This means every error response has a misleading HTTP status code. A 404 Prisma error (P2025) sends HTTP 500 with body `statusCode: 404`. Clients inspecting the HTTP status will think it's a server error, not a not-found. Every consumer of the API must inspect the response body `statusCode` instead of the HTTP status.

---

### MAJ-2: `getCommentsByAuthorId` route param ignored; uses `req.user.id` instead

**File:** `src/modules/comment/comment.route.ts:16` → `comment.controller.ts:27-28`

The route is `GET /author/:authorId`, but the controller:
```ts
const authorId = req.user?.id as string;  // ❌ ignores :authorId param
```

This means the endpoint always returns comments for the **authenticated user**, regardless of `:authorId`. If the intent is "my comments", the route should be `GET /me`. If the intent is admin-fetching-any-user's-comments, it should use `req.params.authorId`.

**Fix:** Choose one intent and align the route with the implementation.

---

### MAJ-3: `createPostIntoDB` redundant `findUniqueOrThrow` call

**File:** `src/modules/post/post.service.ts:16-23`

Every time a post is created, the service fetches the user and their subscription — even though the `auth()` middleware already verified the user exists, fetched the user row, and attached `req.user`. This is an unnecessary database query on every post creation.

**Fix:** Remove the redundant user lookup; only fetch subscription if `payload.isPremium` is true.

---

### MAJ-4: No input validation anywhere

The entire app relies on `req.body` being passed straight to Prisma. There is no validation library (zod, joi, class-validator, etc.) and no manual field-level checks beyond a few existence guards.

Risks:
- **Registration:** no email format check, no password strength check, no name length check
- **Login:** no format validation before DB query
- **Posts/comments:** no content length limits enforced before DB insert
- String arrays (`tags`) are passed directly from the request body

---

### MAJ-5: Comment `deleteCommentFromDB` double-works the ID

**File:** `src/modules/comment/comment.service.ts:117-146`

```ts
const commentData = await prisma.comment.findUniqueOrThrow({
  where: { id: commentId, authorId },   // validates ownership
});
// ... then deletes by commentData.id instead of the already-validated commentId
await prisma.comment.delete({
  where: { id: commentData.id },
});
```

The `findUniqueOrThrow` already proves the comment belongs to the user. The delete could use `commentId` directly. Minor on its own, but it highlights a pattern inconsistency vs. the post module (which separates the find and the authorization check from the delete).

---

### MAJ-6: `registerUserIntoDB` has a stale duplicate-email check (race window)

**File:** `src/modules/users/user.service.ts:11-15`

```ts
const isUserExists = await prisma.user.findUnique({ where: { email } });
```

The existence check is commented out on lines 17-19 (no error is thrown), so duplicate emails will hit the unique constraint and throw `P2002` → mapped to 409. The unused query is wasted. Either re-enable the check or remove the dead query.

---

## 🟡 Minor Issues

### MIN-1: `getPostStatsFromDB` — redundant `await` on each Promise.all member

**File:** `src/modules/post/post.service.ts:382-414`

```ts
await Promise.all([
  await tx.post.count(),        // ❌ redundant await
  await tx.post.count({ ... }), // ❌ redundant await
  ...
]);
```

The `await` inside `Promise.all()` is unnecessary. Each `.count()` returns a Promise, and `Promise.all` accepts promises. The outer `await` on `Promise.all` is sufficient. The redundant `await` forces sequential execution, defeating the purpose of `Promise.all`.

**Fix:** Remove the inner `await` keywords.

---

### MIN-2: Unused imports

| File | Unused Import |
|---|---|
| `src/utils/catchAsync.ts:1` | `httpStatus` |
| `src/modules/auth/auth.service.ts:3` | `catchAsync` |
| `src/modules/comment/comment.service.ts:1` | `Payload` from `prismaNamespace` |

---

### MIN-3: `IDeletePostPayload` is never used (dead code)

**File:** `src/modules/post/post.interface.ts:24-32`

```ts
export interface IDeletePostPayload { ... }  // identical to IUpdatePostPayload, never referenced anywhere
```

The delete endpoint only uses `postId`, not a payload body. Remove the unused interface.

---

### MIN-4: `getMyPostsFromDB` lacks pagination

**File:** `src/modules/post/post.service.ts:432-456`

Unlike `getAllPostsFromDB` (which has full pagination), `getMyPosts` returns every post for the author with no `page`/`limit` support. For authors with many posts, this is a performance issue and a poor UX.

---

### MIN-5: `getCommentsByPostIdFromDB` lacks pagination

**File:** `src/modules/comment/comment.service.ts:68-75`

No pagination on post comments. A popular post with hundreds of comments will return them all at once.

---

### MIN-6: `jwtUtils.createToken` incorrectly types `expiresIn` parameter

**File:** `src/utils/jwt.ts:5-6`

```ts
const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {
  const token = jwt.sign(payload, secret, expiresIn);
```

`expiresIn` is typed as `SignOptions`, but `jwt.sign` expects `SignOptions` as the 3rd argument. Passing `{ expiresIn: "1d" }` as `SignOptions` actually works because `SignOptions` includes the `expiresIn` field, but the parameter name and type are misleading. The caller passes `{ expiresIn: config.jwt_access_expires_in } as SignOptions` (cast). A cleaner approach would be to pass the string directly and inline it.

---

### MIN-7: `tsx watch` restarts before Prisma client is regenerated

If a schema change is made during development, the dev server may restart before `npx prisma generate` completes, causing import errors. The workflow requires manual intervention (`npx prisma generate` then restart the dev server). Not a code bug, but a DX friction point.

---

### MIN-8: Cookie `secure: false` in production-like config

**File:** `src/modules/auth/auth.controller.ts:15-16, 22-23, 49-50, 55-56, 76-77`

Cookies are set with `secure: false` and `sameSite: "none"`. The combination `sameSite: "none"` without `secure: true` will be rejected by modern browsers. In production, this breaks cookie-based auth entirely.

---

## ⚪ Suggestions & Improvements

### SUG-1: Extract shared query logic from `premium.service.ts` and `post.service.ts`

The query building logic (pagination, sorting, filtering, tag parsing, search conditions) is **duplicated verbatim** across two files (~80 lines each). Consider extracting a shared query builder utility or a Prisma query helper.

### SUG-2: Add a health-check endpoint

A `GET /health` or `GET /api/health` that returns `{ status: "ok", timestamp }` is useful for monitoring and deployment health checks. Could also include a lightweight DB ping.

### SUG-3: Strip excessive commented code

Nearly every file in the project has large blocks of dead commented code (alternative implementations, old `try/catch` handlers, commented-out query approaches). This adds noise and makes the actual logic harder to read. Clean it up.

### SUG-4: Add rate limiting to auth routes

The login endpoint has no rate limiting, making it vulnerable to brute-force password attacks. Consider `express-rate-limit` on `/api/auth/login`.

### SUG-5: Webhook should return a 200 with empty body (no JSON)

**File:** `src/modules/subscription/subscription.controller.ts:31-35`

Stripe webhooks expect a 200 response with an empty body. Sending a JSON response is harmless but unnecessary extra work. Consider: `res.sendStatus(200)`.

### SUG-6: Use a validation library

Introducing `zod` would replace all ad-hoc inline checks with a single declarative validation layer and produce type-safe payloads.

### SUG-7: Align response shape

Some controllers nest data as `{ data: { user } }`, others as `{ data: result }`. Decide on a convention (prefer `{ data: result }`) and apply it consistently.

### SUG-8: `comments` include in post queries is expensive

**File:** `src/modules/post/post.service.ts:284-285`

Including all `comments` on every `getAllPosts` call fetches every comment for every returned post. For a list endpoint, this is potentially expensive. Consider replacing with `_count: { select: { comments: true } }` to get just the comment count, and only fetch full comments on the single-post detail endpoint.

---

## Summary

| Category | Count |
|---|---|
| 🔴 Critical | 4 |
| 🟠 Major | 6 |
| 🟡 Minor | 8 |
| ⚪ Suggestion | 8 |
| **Total** | **26** |

### Most impactful fixes (highest priority)

1. **CRIT-1** — Fix `getCommentsByPostId` to query by `postId` (data correctness bug)
2. **CRIT-2** — Fix `globalErrorHandler` to send the correct HTTP status (all error responses are broken)
3. **CRIT-3** — Add `currentPeriodEnd` check to `premiumGuard` (bypassable paywall)
4. **CRIT-4** — Remove `id` from `ICreateCommentPayload` (broken interface contract)
5. **MAJ-1** — Same as CRIT-2 (client-facing contract issue)
6. **MAJ-2** — Fix `getCommentsByAuthorId` route vs. controller mismatch
