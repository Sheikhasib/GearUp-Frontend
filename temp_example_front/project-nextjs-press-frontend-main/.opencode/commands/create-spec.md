---
description: Create a spec file and feature branch for a new feature
argument-hint: "Feature name, e.g. news-search or premium-paywall"
allowed-tools: Read, Write, Glob, Bash(git:*)
---

You are a senior developer spinning up a new feature for a Next.js press/news site.
Always follow the conventions in AGENTS.md if it exists.

User input: $ARGUMENTS

## Step 1 — Parse the arguments

From $ARGUMENTS extract:

1. `feature_title` — human readable title in Title Case
   - Example: "News Search" or "Premium Paywall"
2. `feature_slug` — git and file safe slug
   - Lowercase, kebab-case
   - Only a-z, 0-9 and -
   - Maximum 40 characters
   - Example: news-search, premium-paywall
3. `branch_name` — format: `feature/<feature_slug>`
   - Example: `feature/news-search`

If you cannot infer these from $ARGUMENTS, ask the user
to clarify before proceeding.

## Step 2 — Research the codebase

Read these before writing the spec:

- `AGENTS.md` — conventions and project notes
- `app/` — existing route groups (authGroup, dashboardGroup, publicGroup)
- `components/` — existing shared and ui components (shadcn/ui)
- `lib/types.ts` — existing type definitions (IPost, IAuthor, IComment, etc.)
- `app/globals.css` — Tailwind v4 design tokens via `@theme` directive
- `service/` — server-only fetch helpers (getMe, logout, refreshToken)
- All files in `.opencode/specs/` — avoid duplicating existing specs

## Step 3 — Create the feature branch

Run:

```
git checkout -b <branch_name>
```

If the branch already exists, check it out instead and tell the user
you're continuing on an existing branch rather than creating a new one.

## Step 4 — Write the spec

Generate a spec document with this exact structure:

# Spec: <feature_title>

## Overview

One paragraph describing what this feature does and why it's being added
to the press site.

## Depends on

Which existing routes, components, service files, or types this feature builds on
(e.g. "Auth flow via `proxy.ts`", "IPost type in `lib/types.ts`").

## Routes

Any new App Router routes/pages needed within the appropriate route group:

- `app/(publicGroup)/<route>` — public pages
- `app/(authGroup)/<route>` — login/register pages
- `app/(dashboardGroup)/<route>` — role-based dashboard pages

If no new routes: state "No new routes".

## Server actions

Any new server actions needed in `app/*/_actions/` — co-located with
the route group they belong to.

## Components

- **Create:** new component files with their path
  - `components/ui/` for primitives (shadcn style)
  - `components/shared/` for app-specific components
- **Modify:** existing components and what changes

## Service layer changes

New or updated files in `service/` for server-only fetch operations
that forward httpOnly cookies to the backend.

## Files to change

Every file that will be modified.

## Files to create

Every new file that will be created.

## New dependencies

Any new npm packages. If none: state "No new dependencies".

## Rules for implementation

Specific constraints to follow. Always include:

- Use existing shadcn/ui components from `components/ui/` — don't
  introduce new primitives unnecessarily.
- Server actions go in `app/*/_actions/` with `"use server"` at the top.
- Data fetching from the backend goes through `service/` helpers
  (which forward cookies) or server actions — never fetch directly
  from client components.
- Use Tailwind v4 `@theme` tokens from `globals.css` — no hardcoded
  color values.
- Auth-aware components check `getMe()` response; handle both
  authenticated and unauthenticated states.

## Definition of done

A specific testable checklist. Each item must be verifiable by running
`npm run dev` and checking the result in the browser.

---

## Step 5 — Save the spec

Save to: `.opencode/specs/<feature_slug>.md`

## Step 6 — Report to the user

Print a short summary in this exact format:

```
Branch:    <branch_name>
Spec file: .opencode/specs/<feature_slug>.md
Title:     <feature_title>
```

Then tell the user:
"Review the spec at `.opencode/specs/<feature_slug>.md`
then enter Plan Mode with Shift+Tab twice to begin implementation."

Do not print the full spec in chat unless explicitly asked.
