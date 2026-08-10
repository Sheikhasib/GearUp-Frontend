import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  subject: z.string().trim().min(2, "Subject must be at least 2 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters"),
})

export type ContactInput = z.infer<typeof contactSchema>
