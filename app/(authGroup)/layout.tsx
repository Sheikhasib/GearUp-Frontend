import { Navbar } from "@/components/shared/navbar"
import { getMe } from "@/service/getMe"
import type { ReactNode } from "react"

const AuthGrouplayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe()

  return (
    <div>
      <Navbar user={user} />
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  )
}

export default AuthGrouplayout
