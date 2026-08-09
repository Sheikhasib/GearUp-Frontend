"use client"

import { useEffect, useRef, useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import { changePasswordAction } from "@/app/(publicGroup)/_actions/profileActions"
import { toast } from "sonner"

const labelClass =
  "mb-1.5 block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
const inputClass =
  "h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 focus:ring-1 focus:ring-primary aria-invalid:border-destructive pr-9"

export function PasswordForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [state, action, pending] = useActionState(changePasswordAction, {
    success: false,
    message: "",
    errors: {},
  })

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      formRef.current?.reset()
    } else {
      toast.error(state.message)
    }
  }, [state])

  const passwordFields = [
    {
      name: "currentPassword",
      label: "Current Password",
      id: "password-current",
    },
    {
      name: "newPassword",
      label: "New Password",
      id: "password-new",
    },
    {
      name: "confirmPassword",
      label: "Confirm New Password",
      id: "password-confirm",
    },
  ]

  return (
    <form ref={formRef} action={action} className="space-y-5">
      {passwordFields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.id} className={labelClass}>
            {field.label}
          </label>
          <div className="relative">
            <input
              id={field.id}
              name={field.name}
              type={showPassword ? "text" : "password"}
              className={inputClass}
              placeholder={
                field.name === "currentPassword"
                  ? "Enter your current password"
                  : "Enter your new password"
              }
              aria-invalid={Boolean(state.errors?.[field.name]?.length)}
              aria-describedby={
                state.errors?.[field.name]
                  ?.map((_, i) => `${field.id}-error-${i}`)
                  .join(" ") || undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide passwords" : "Show passwords"}
              className="absolute right-0 top-0 flex h-10 w-9 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {state.errors?.[field.name]?.map((e, i) => (
            <p
              key={i}
              id={`${field.id}-error-${i}`}
              className="mt-1 text-sm text-destructive"
            >
              {e}
            </p>
          ))}
        </div>
      ))}

      {state?.message && !state?.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={pending} className="cursor-pointer">
        {pending ? "Changing..." : "Change Password"}
      </Button>
    </form>
  )
}