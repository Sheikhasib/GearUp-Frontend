import Link from "next/link"
import { getMe } from "@/service/getMe"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "./_components/ProfileForm"
import { SignIn } from "@phosphor-icons/react/ssr"

const SettingsPage = async () => {
  const result = await getMe()

  if (!result.success) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Sign in to manage your profile settings.
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <div className="mt-8 max-w-2xl">
        <ProfileForm user={result.data} />
      </div>
    </div>
  )
}

export default SettingsPage
