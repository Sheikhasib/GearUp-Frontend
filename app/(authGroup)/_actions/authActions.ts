"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken"
import { loginSchema, registerSchema } from "./auth.schema"

export type AuthActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

type DemoRole = "CUSTOMER" | "PROVIDER" | "ADMIN"

const setAuthCookies = async (accessToken: string, refreshToken: string) => {
  const cookieStore = await cookies()

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  cookieStore.set("accessTokenClient", accessToken, {
    httpOnly: false,
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

const redirectByRole = (accessToken: string): never => {
  const decodedToken = jwt.decode(accessToken) as JwtPayload

  if (decodedToken.role === "ADMIN") {
    redirect("/admin-dashboard")
  } else if (decodedToken.role === "PROVIDER") {
    redirect("/provider-dashboard")
  } else {
    redirect("/customer-dashboard")
  }
}

export const loginAction = async (
  redirectTo: string,
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> => {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
    cache: "no-cache",
  })

  const result = await res.json()

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Invalid email or password",
    }
  }

  const { accessToken, refreshToken } = result.data

  await setAuthCookies(accessToken, refreshToken)

  if (
    redirectTo &&
    typeof redirectTo === "string" &&
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//")
  ) {
    redirect(redirectTo)
  }

  return redirectByRole(accessToken)
}

export const registerAction = async (
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> => {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    role: formData.get("role") as "CUSTOMER" | "PROVIDER",
    phone: (formData.get("phone") as string) || undefined,
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { confirmPassword: _, ...payload } = parsed.data

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-cache",
  })

  const result = await res.json()

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Registration failed",
    }
  }

  redirect("/login?registered=true")
}

export const logoutAction = async () => {
  const cookieStore = await cookies()
  cookieStore.delete("accessToken")
  cookieStore.delete("accessTokenClient")
  cookieStore.delete("refreshToken")
  redirect("/")
}

export const googleAuthAction = async (
  idToken: string
): Promise<AuthActionState> => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    cache: "no-cache",
  })

  const result = await res.json()

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Google sign-in failed",
    }
  }

  const { accessToken, refreshToken } = result.data

  await setAuthCookies(accessToken, refreshToken)

  return redirectByRole(accessToken)
}

export const demoLoginAction = async (
  role: DemoRole
): Promise<AuthActionState> => {
  const email = process.env[`DEMO_${role}_EMAIL`]
  const password = process.env[`DEMO_${role}_PASSWORD`]

  if (!email || !password) {
    return {
      success: false,
      message:
        "Demo login is not configured. Please sign in with your account.",
    }
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-cache",
  })

  const result = await res.json()

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Demo login failed",
    }
  }

  const { accessToken, refreshToken } = result.data

  await setAuthCookies(accessToken, refreshToken)

  return redirectByRole(accessToken)
}
