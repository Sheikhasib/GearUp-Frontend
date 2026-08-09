import Link from "next/link"
import { getMe } from "@/service/getMe"
import { getInitials } from "@/utils"
import {
  USER_STATUS_LABELS,
  USER_STATUS_STYLES,
} from "@/lib/badgeStyles"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CardField } from "@/components/shared/card-field"
import { GoBackButton } from "@/components/shared/go-back-button"
import { ProfileForm } from "@/components/shared/ProfileForm"
import { PasswordForm } from "@/components/shared/PasswordForm"
import { SignIn, Gauge } from "@phosphor-icons/react/ssr"

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Customer",
  PROVIDER: "Provider",
  ADMIN: "Admin",
}

const ROLE_LINKS: Record<string, string> = {
  CUSTOMER: "/customer-dashboard",
  PROVIDER: "/provider-dashboard",
  ADMIN: "/admin-dashboard",
}

const joinedAtFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

const formatJoinedAt = (value?: string) =>
  value ? joinedAtFormatter.format(new Date(value)) : "N/A"

const ProfilePage = async () => {
  const result = await getMe()

  if (!result.success) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Sign in to view and manage your profile details.
        </p>
        <Button size="sm" className="mt-8" asChild>
          <Link href="/login">
            <SignIn className="mr-1" />
            Log In
          </Link>
        </Button>
      </div>
    )
  }

  const user = result.data

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <GoBackButton label="Back" />

      <h1 className="mt-4 text-3xl font-bold tracking-tight">My Profile</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Avatar className="size-20">
              {user.avatarUrl ? (
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.name || "Avatar"}
                />
              ) : (
                <AvatarFallback className="text-2xl text-primary">
                  {getInitials(user.name || "N/A")}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-center">
              <p className="font-heading text-lg font-semibold tracking-wide uppercase">
                {user.name || "N/A"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
            <span
              className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${
                USER_STATUS_STYLES[user.status] || "bg-gray-50 text-gray-600 ring-gray-200"
              }`}
            >
              {USER_STATUS_LABELS[user.status] || user.status}
            </span>
            <div className="mt-2 w-full border-t pt-5">
              <dl className="grid gap-4">
                <CardField label="Role">
                  {ROLE_LABELS[user.role] || user.role}
                </CardField>
                <CardField label="Member Since">
                  {formatJoinedAt(user.createdAt)}
                </CardField>
              </dl>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ProfileForm
                defaultValues={{
                  name: user.name,
                  phone: user.phone,
                  avatarUrl: user.avatarUrl,
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <PasswordForm />
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" asChild>
              <Link href={ROLE_LINKS[user.role] || "/"}>
                <Gauge className="mr-1" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
