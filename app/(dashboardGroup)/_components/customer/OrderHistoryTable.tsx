"use client"

import Link from "next/link"
import { useCustomerOrders } from "../../_hooks/useCustomerOrders"
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/badgeStyles"

export function OrderHistoryTable() {
  const { data: orders, isLoading } = useCustomerOrders()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <p className="text-lg">No orders yet</p>
        <Link
          href="/gears"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Browse gear to rent
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-col justify-between gap-4 bg-card p-5 ring-1 ring-foreground/5 sm:flex-row sm:items-center"
        >
          <div className="min-w-0 space-y-1">
            <p className="truncate font-heading font-semibold">
              {order.gearItem?.name ?? "Gear"}
            </p>
            <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
              <span>
                {new Date(order.startDate).toLocaleDateString()} –{" "}
                {new Date(order.endDate).toLocaleDateString()}
              </span>
              <span>x{order.quantity}</span>
              <span>${order.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${STATUS_STYLES[order.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
            >
              {STATUS_LABELS[order.status] || order.status}
            </span>

            {order.status === "CONFIRMED" && (
              <Link
                href={`/customer-dashboard/orders/${order.id}/pay`}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Pay Now
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
