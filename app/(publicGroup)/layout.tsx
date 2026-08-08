import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { getMe } from "@/service/getMe"
import React from "react"

const PublicGroupLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const user = await getMe()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default PublicGroupLayout
