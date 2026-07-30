"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export function CustomerDashboardClient() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("orderCreated") === "true") {
      toast.success("Order placed — waiting for provider confirmation.")
    }
  }, [searchParams])

  return null
}
