"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { getAccessToken } from "@/service/refreshToken"
import type { IUser } from "@/lib/types"

export type UpdateProfileState = {
  success: boolean
  message: string
  user?: IUser
  errors?: Record<string, string[]>
}

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  avatarUrl: z
    .string()
    .url("Avatar URL must be a valid URL")
    .optional()
    .or(z.literal("")),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(4, "New password must be at least 4 characters").optional(),
  confirmPassword: z.string().optional(),
})

const updateProfileFormSchema = updateProfileSchema.refine(
  (data) => !data.newPassword || data.newPassword === data.confirmPassword,
  {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  }
)

export const updateProfileAction = async (
  prevState: UpdateProfileState | undefined,
  formData: FormData
): Promise<UpdateProfileState> => {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return {
      success: false,
      message: "Unauthorized. Please login again.",
    }
  }

  const raw = {
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || undefined,
    avatarUrl: (formData.get("avatarUrl") as string) || "",
    currentPassword: (formData.get("currentPassword") as string) || undefined,
    newPassword: (formData.get("newPassword") as string) || undefined,
    confirmPassword: (formData.get("confirmPassword") as string) || undefined,
  }

  const parsed = updateProfileFormSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const payload: Record<string, unknown> = {
    name: parsed.data.name,
    phone: parsed.data.phone ?? "",
  }

  if (parsed.data.avatarUrl) payload.avatarUrl = parsed.data.avatarUrl

  if (parsed.data.currentPassword) {
    payload.currentPassword = parsed.data.currentPassword
  }
  if (parsed.data.newPassword) {
    payload.newPassword = parsed.data.newPassword
  }

  try {
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

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to update profile.",
      }
    }

    revalidateTag("my-profile", "max")
    revalidatePath("/profile")
    revalidatePath("/settings")

    return {
      success: true,
      message: "Profile updated successfully.",
      user: result.data as IUser,
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}
