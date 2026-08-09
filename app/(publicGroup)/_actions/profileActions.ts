"use server"

import { revalidateTag } from "next/cache"
import { getAccessToken } from "@/service/refreshToken"
import {
  changePasswordSchema,
  profileSchema,
} from "@/lib/validations/profile"

export type ProfileActionState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export const updateProfileAction = async (
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> => {
  const raw = {
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || undefined,
    avatarUrl: (formData.get("avatarUrl") as string) || undefined,
  }

  const parsed = profileSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const accessToken = await getAccessToken()
  if (!accessToken) {
    return {
      success: false,
      message: "Your session has expired. Please sign in again.",
    }
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    body: JSON.stringify(parsed.data),
    cache: "no-cache",
  })

  const result = await res.json()

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to update profile",
    }
  }

  revalidateTag("my-profile", "max")

  return {
    success: true,
    message: "Profile updated successfully",
  }
}

export const changePasswordAction = async (
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> => {
  const raw = {
    currentPassword: formData.get("currentPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  }

  const parsed = changePasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const accessToken = await getAccessToken()
  if (!accessToken) {
    return {
      success: false,
      message: "Invalid token. Please sign in again.",
    }
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    body: JSON.stringify({
      currentPassword: parsed.data.currentPassword,
      newPassword: parsed.data.newPassword,
    }),
    cache: "no-cache",
  })

  const result = await res.json()

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Failed to change password",
    }
  }

  return {
    success: true,
    message: "Password changed successfully",
  }
}