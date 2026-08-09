import { z } from "zod"

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().optional(),
  avatarUrl: z
    .union([z.literal(""), z.string().trim().url("Please enter a valid image URL")])
    .optional(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(4, "New password must be at least 4 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ProfileInput = z.infer<typeof profileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>