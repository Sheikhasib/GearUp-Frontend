"use client"

import { useEffect, useMemo, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useCustomerOrders } from "../_hooks/useCustomerOrders"
import { useCustomerPayments } from "../_hooks/useCustomerPayments"
import { ChartCard } from "@/components/charts/ChartCard"
import { StatusDonutChart } from "@/components/charts/StatusDonutChart"
import { RevenueLineChart } from "@/components/charts/RevenueLineChart"

export function CustomerDashboardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderCreated = searchParams.get("orderCreated")
  const handled = useRef(false)

  const { data: orders, isLoading: isLoadingOrders, isError: isErrorOrders } =
    useCustomerOrders()
  const { data: payments, isLoading: isLoadingPayments, isError: isErrorPayments } =
    useCustomerPayments()

  const ordersByStatus = useMemo(() => {
    if (!orders) return []
    const counts = new Map<string, number>()
    for (const order of orders) {
      counts.set(order.status, (counts.get(order.status) ?? 0) + 1)
    }
    return Array.from(counts, ([status, count]) => ({ status, count }))
  }, [orders])

  const spendOverTime = useMemo(() => {
    if (!payments) return []
    const counts = new Map<string, number>()
    for (const payment of payments) {
      if (payment.status !== "PAID" || !payment.paidAt) continue
      const date = payment.paidAt.slice(0, 10)
      counts.set(date, (counts.get(date) ?? 0) + payment.amount)
    }
    return Array.from(counts, ([date, revenue]) => ({ date, revenue })).sort(
      (a, b) => a.date.localeCompare(b.date)
    )
  }, [payments])

  useEffect(() => {
    if (orderCreated !== "true" || handled.current) return
    handled.current = true

    toast.success("Order placed — waiting for provider confirmation.")

    const params = new URLSearchParams(searchParams.toString())
    params.delete("orderCreated")
    const queryString = params.toString()

    router.replace(
      queryString
        ? `/customer-dashboard?${queryString}`
        : "/customer-dashboard",
      {
        scroll: false,
      }
    )
  }, [orderCreated, router, searchParams])

  return (
    <>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Orders by Status"
          description="Your rental orders"
          loading={isLoadingOrders}
          error={isErrorOrders}
          empty={ordersByStatus.length === 0}
        >
          <div className="h-64">
            <StatusDonutChart data={ordersByStatus} />
          </div>
        </ChartCard>

        <ChartCard
          title="Spending Over Time"
          description="Paid orders"
          loading={isLoadingPayments}
          error={isErrorPayments}
          empty={spendOverTime.length === 0}
        >
          <div className="h-64">
            <RevenueLineChart data={spendOverTime} />
          </div>
        </ChartCard>
      </div>
    </>
  )
}
