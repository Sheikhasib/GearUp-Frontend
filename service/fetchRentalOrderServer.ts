"use server"

import { cookies } from "next/headers"
import type { IRentalOrder } from "@/lib/types"

const API_BASE = process.env.BACKEND_API_URL || "http://localhost:4000"

export async function fetchRentalOrderServer(id: string): Promise<IRentalOrder | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  if (!accessToken) return null

  try {
    const res = await fetch(`${API_BASE}/api/rentals/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-cache",
    })
    const json = await res.json()
    if (!json.success) return null
    return json.data ?? null
  } catch {
    return null
  }
}
