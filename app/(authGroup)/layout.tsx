import { Navbar } from "@/components/shared/navbar"
import { getMe } from "@/service/getMe"
import { AuthProviders } from "./_components/AuthProviders"

const AuthGrouplayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe()

  return (
    <div>
      <Navbar user={user} />
      <div className="mx-auto max-w-7xl">
        <AuthProviders>{children}</AuthProviders>
      </div>
    </div>
  )
}

export default AuthGrouplayout