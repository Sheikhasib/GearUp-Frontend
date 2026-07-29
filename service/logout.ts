"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const logout = async () => {
  const cookieStore = await cookies()

  cookieStore.delete("accessToken")
  cookieStore.delete("refreshToken")

  // to invalidate the cache
  revalidateTag("my-profile", "max")

  // navigate to login page
  // redirect("/login");
}
