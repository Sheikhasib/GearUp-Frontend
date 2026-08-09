"use client"

import { useEffect, useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/shared/image-upload"
import { updateProfileAction } from "@/app/(publicGroup)/_actions/profileActions"
import { toast } from "sonner"

interface ProfileFormProps {
  defaultValues: {
    name?: string
    phone?: string
    avatarUrl?: string
  }
}

const labelClass =
  "mb-1.5 block text-xs font-semibold tracking-widest uppercase text-muted-foreground"
const inputClass =
  "h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 focus:ring-1 focus:ring-primary aria-invalid:border-destructive"

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [avatarUrl, setAvatarUrl] = useState(defaultValues.avatarUrl ?? "")
  const [state, action, pending] = useActionState(updateProfileAction, {
    success: false,
    message: "",
    errors: {},
  })

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
    } else {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="profile-avatar" className={labelClass}>
          Avatar
        </label>
        <ImageUpload
          value={avatarUrl}
          onChange={setAvatarUrl}
          alt="Profile avatar"
        />
        <input type="hidden" name="avatarUrl" value={avatarUrl} />
      </div>

      <div>
        <label htmlFor="profile-name" className={labelClass}>
          Full Name
        </label>
        <input
          id="profile-name"
          name="name"
          type="text"
          defaultValue={defaultValues.name ?? ""}
          className={inputClass}
          placeholder="Your full name"
          aria-invalid={Boolean(state.errors?.name?.length)}
          aria-describedby={
            state.errors?.name
              ?.map((_, i) => `profile-name-error-${i}`)
              .join(" ") || undefined
          }
        />
        {state.errors?.name?.map((e, i) => (
          <p
            key={i}
            id={`profile-name-error-${i}`}
            className="mt-1 text-sm text-destructive"
          >
            {e}
          </p>
        ))}
      </div>

      <div>
        <label htmlFor="profile-phone" className={labelClass}>
          Phone
        </label>
        <input
          id="profile-phone"
          name="phone"
          type="tel"
          defaultValue={defaultValues.phone ?? ""}
          className={inputClass}
          placeholder="Optional"
          aria-invalid={Boolean(state.errors?.phone?.length)}
          aria-describedby={
            state.errors?.phone
              ?.map((_, i) => `profile-phone-error-${i}`)
              .join(" ") || undefined
          }
        />
        {state.errors?.phone?.map((e, i) => (
          <p
            key={i}
            id={`profile-phone-error-${i}`}
            className="mt-1 text-sm text-destructive"
          >
            {e}
          </p>
        ))}
      </div>

      {state.errors?.avatarUrl?.map((e, i) => (
        <p key={i} className="text-sm text-destructive">
          {e}
        </p>
      ))}

      {state?.message && !state?.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={pending} className="cursor-pointer">
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}