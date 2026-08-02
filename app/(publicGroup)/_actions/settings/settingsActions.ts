"use server"

import { cookies } from "next/headers"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import type { IUser } from "@/lib/types"

export type UpdateProfileState = {
  success: boolean
  message: string
  user?: IUser
  errors?: Record<string, string[]>
}

const updateProfileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().optional(),
    avatarUrl: z
      .string()
      .url("Avatar URL must be a valid URL")
      .optional()
      .or(z.literal("")),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(4, "New password must be at least 4 characters")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: "New passwords do not match",
      path: ["confirmPassword"],
    },
  )

export const updateProfileAction = async (
  prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    return { success: false, message: "Unauthorized. Please login again." }
  }

  const raw = {
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || undefined,
    avatarUrl: (formData.get("avatarUrl") as string) || undefined,
    currentPassword:
      (formData.get("currentPassword") as string) || undefined,
    newPassword: (formData.get("newPassword") as string) || undefined,
    confirmPassword:
      (formData.get("confirmPassword") as string) || undefined,
  }

  const parsed = updateProfileSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const payload: {
    name: string
    phone?: string
    avatarUrl?: string
    currentPassword?: string
    newPassword?: string
  } = {
    name: parsed.data.name,
  }

  if (parsed.data.phone !== undefined) payload.phone = parsed.data.phone
  if (parsed.data.avatarUrl !== undefined)
    payload.avatarUrl = parsed.data.avatarUrl
  if (parsed.data.newPassword) {
    payload.currentPassword = parsed.data.currentPassword
    payload.newPassword = parsed.data.newPassword
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
    body: JSON.stringify(payload),
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
  revalidatePath("/profile")
  revalidatePath("/settings")

  return {
    success: true,
    message: "Profile updated successfully",
    user: result.data as IUser,
  }
}
