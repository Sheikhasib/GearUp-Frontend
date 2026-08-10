"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import { contactSchema, type ContactInput } from "@/lib/validations/contact"
import { createContactMessage } from "@/lib/api/contact"
import { Button } from "@/components/ui/button"

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 focus:ring-1 focus:ring-primary"
const labelClass =
  "mb-1.5 block text-xs font-semibold tracking-widest uppercase text-muted-foreground"

export function ContactForm() {
  const [pending, setPending] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  })

  const onSubmit = async (data: ContactInput) => {
    setPending(true)
    try {
      await createContactMessage(data)
      toast.success("Message sent — we'll reply soon.")
      reset()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className={inputClass}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={inputClass}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input
          id="subject"
          {...register("subject")}
          className={inputClass}
          placeholder="How can we help?"
        />
        {errors.subject && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          {...register("message")}
          rows={5}
          className={`${inputClass} resize-none`}
          placeholder="Tell us more about your question…"
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={pending} className="w-full cursor-pointer sm:w-auto">
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  )
}
