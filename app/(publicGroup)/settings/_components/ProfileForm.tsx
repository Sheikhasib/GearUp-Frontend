"use client"

import { useEffect, useState } from "react"
import { CldUploadButton } from "next-cloudinary"
import { useFormState, useFormStatus } from "react-dom"
import Image from "next/image"
import { updateProfileAction, type UpdateProfileState } from "@/app/(publicGroup)/_actions/settings/settingsActions"
import type { IUser } from "@/lib/types"

const initialState: UpdateProfileState = {
  success: false,
  message: "",
}

const AvatarUploader = ({
  avatarUrl,
  onUpload,
}: {
  avatarUrl: string
  onUpload: (url: string) => void
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-100">
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Avatar preview" fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl text-slate-400">
            👤
          </div>
        )}
      </div>
      <CldUploadButton
        options={{
          maxFiles: 1,
          resourceType: "image",
          folder: "gearup/avatars",
          clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
        }}
        uploadPreset="gearup_products"
        onSuccess={(result) => {
          const info = result?.info
          if (typeof info === "object" && info?.secure_url) {
            onUpload(info.secure_url)
          }
        }}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Upload avatar
      </CldUploadButton>
    </div>
  )
}

const SubmitButton = () => {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  )
}

export const ProfileForm = ({ user }: { user: IUser }) => {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "")

  const [state, formAction] = useFormState(updateProfileAction, initialState)

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    if (!state.message) return
    const show = setTimeout(
      () => setToast({ type: state.success ? "success" : "error", message: state.message }),
      0
    )
    const hide = setTimeout(() => setToast(null), 4000)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [state])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {toast && (
        <div
          className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {toast.message}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Avatar</label>
          <AvatarUploader avatarUrl={avatarUrl} onUpload={setAvatarUrl} />
          <input type="hidden" name="avatarUrl" value={avatarUrl} />
        </div>

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {state.errors?.name && (
            <p className="mt-1 text-xs text-red-600">{state.errors.name.join(", ")}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={user.phone || ""}
            placeholder="e.g. 01712345678"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            defaultValue={user.email}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
          />
          <p className="mt-1 text-xs text-slate-400">Email cannot be changed.</p>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="At least 4 characters"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
              {state.errors?.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {state.errors.confirmPassword.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}

export default ProfileForm
