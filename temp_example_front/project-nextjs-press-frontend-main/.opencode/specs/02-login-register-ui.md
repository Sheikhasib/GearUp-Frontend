# Spec: Login & Register Pages

## Overview

Polish the existing login and register pages with proper navigation between them, client-side validation, password visibility toggles, and mobile responsiveness. The forms and server actions are already built — this spec focuses on UX completeness and visual refinement.

## Depends on

- `app/(authGroup)/login/page.tsx` — exists, renders LoginForm
- `app/(authGroup)/register/page.tsx` — exists, renders RegisterForm
- `app/(authGroup)/_components/LoginForm.tsx` — exists, functional (useActionState, email/password, toast)
- `app/(authGroup)/_components/RegisterForm.tsx` — exists, functional (name/email/password/confirmPassword/profilePhoto, avatar preview, toast)
- `app/(authGroup)/_actions/authActions.ts` — exists, loginAction (JWT cookie set + role-based redirect) + registerAction (validation + redirect to /login)
- `app/(authGroup)/layout.tsx` — exists, fetches getMe(), renders Navbar
- `shadcn/ui` components: Button, Card, Input already used
- `proxy.ts` — AUTH_ROUTES redirect logic (logged-in users skip auth pages)

## Routes

- `/login` — login page (exists, needs polish)
- `/register` — register page (exists, needs polish)

## Components

- **Modify:** `app/(authGroup)/_components/LoginForm.tsx` — add password visibility toggle, client-side email format validation, "Don't have an account?" link to /register
- **Modify:** `app/(authGroup)/_components/RegisterForm.tsx` — add password visibility toggle (both fields), client-side validation (email format, password match, min length), "Already have an account?" link to /login
- **Modify:** `app/(authGroup)/login/page.tsx` — replace `text-gray-500` with Tailwind v4 `text-muted-foreground`, add link to register page below the form
- **Modify:** `app/(authGroup)/register/page.tsx` — replace `text-gray-500` with `text-muted-foreground`, add link to login page below the form

## Files to change

- `app/(authGroup)/login/page.tsx`
- `app/(authGroup)/register/page.tsx`
- `app/(authGroup)/_components/LoginForm.tsx`
- `app/(authGroup)/_components/RegisterForm.tsx`

## Files to create

None.

## New dependencies

No new dependencies.

## Rules for implementation

- Password visibility toggle: use a lucide `Eye`/`EyeOff` icon button inside the input, toggle `type` between `"password"` and `"text"`
- Client-side validation must not replace server-side validation — show errors inline but always let the server action run
- Use `useState` for local validation messages; clear them on input change
- Links between pages use Next.js `<Link>` component
- Use theme tokens from `globals.css` (`text-muted-foreground`, `text-primary`, etc.) — no hardcoded color values like `text-gray-500`
- Keep existing useActionState + toast pattern intact for server feedback
- Login form: email input should use `type="email"` for browser-level validation (already done)
- Register form: password minimum 6 characters (match backend expectation if known)
- Both forms should be fully keyboard-navigable and accessible (label associations, aria attributes)

## Definition of done

1. `/login` shows a centered card with email/password inputs, submit button, and a "Don't have an account? Sign up" link
2. Password field on login has a visibility toggle (eye icon)
3. `/register` shows name/email/password/confirmPassword/photoUrl inputs, avatar preview, submit button, and "Already have an account? Log in" link
4. Both password fields on register have visibility toggles
5. Invalid email format shows client-side message before submit
6. Mismatched passwords show client-side message before submit
7. No `text-gray-500` or other hardcoded colors — all use CSS variable tokens
8. `npm run dev` works without errors; `npx tsc --noEmit` passes
