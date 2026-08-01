"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export function CustomerDashboardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderCreated = searchParams.get("orderCreated")
  const handled = useRef(false)

  useEffect(() => {
    if (orderCreated !== "true" || handled.current) return
    handled.current = true

    toast.success("Order placed — waiting for provider confirmation.")

    const params = new URLSearchParams(searchParams.toString())
    params.delete("orderCreated")
    const queryString = params.toString()

    router.replace(queryString ? `/customer-dashboard?${queryString}` : "/customer-dashboard", {
      scroll: false,
    })
  }, [orderCreated, router, searchParams])

  return null
}
