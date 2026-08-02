"use client"

import { useActionState, useEffect, useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/utils"
import { Camera, Lock } from "@phosphor-icons/react"
import type { IUser } from "@/lib/types"
import { updateProfileAction } from "../../_actions/settings/settingsActions"

interface ProfileFormProps {
  user: IUser
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, action, pending] = useActionState(updateProfileAction, {
    success: false,
    message: "",
  })

  const [name, setName] = useState(user.name || "")
  const [phone, setPhone] = useState(user.phone || "")
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Adjust local state when the server re-fetches a fresh user after a save
  const [prevUser, setPrevUser] = useState(user)
  if (user !== prevUser) {
    setPrevUser(user)
    setName(user.name || "")
    setPhone(user.phone || "")
    setAvatarUrl(user.avatarUrl || "")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  useEffect(() => {
    if (!state?.message) return

    if (state.success) {
      toast.success(state.message)
    } else {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={name || "Avatar"} />
              ) : (
                <AvatarFallback className="text-xl text-primary">
                  {getInitials(name || "N/A")}
                </AvatarFallback>
              )}
            </Avatar>
            <CldUploadWidget
              uploadPreset="gearup_products"
              onSuccess={(result) => {
                const url = (result.info as { secure_url: string }).secure_url
                setAvatarUrl(url)
              }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => open()}
                  className="cursor-pointer"
                >
                  <Camera className="mr-1" />
                  {avatarUrl ? "Change Photo" : "Upload Photo"}
                </Button>
              )}
            </CldUploadWidget>
            {avatarUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAvatarUrl("")}
                className="cursor-pointer"
              >
                Remove
              </Button>
            ) : null}
          </div>

          <input type="hidden" name="avatarUrl" value={avatarUrl} />

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              Full Name
            </label>
            <Input
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {state?.errors?.name?.map((e, i) => (
              <p key={i} className="text-sm text-red-500">
                {e}
              </p>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={user.email || ""}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              Phone
            </label>
            <Input
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              Current Password
            </label>
            <Input
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              New Password
            </label>
            <Input
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            {state?.errors?.newPassword?.map((e, i) => (
              <p key={i} className="text-sm text-red-500">
                {e}
              </p>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              Confirm New Password
            </label>
            <Input
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            {state?.errors?.confirmPassword?.map((e, i) => (
              <p key={i} className="text-sm text-red-500">
                {e}
              </p>
            ))}
          </div>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" />
            Leave password fields blank to keep your current password.
          </p>
        </CardContent>
      </Card>

      <Button className="cursor-pointer" type="submit">
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
