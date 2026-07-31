"use client"

import Link from "next/link"
import { useAdminOrders } from "../../_hooks/useAdmin"
import {
  STATUS_LABELS,
  STATUS_STYLES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
} from "@/lib/badgeStyles"

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export function OrderModerationTable() {
  const { data: orders, isLoading } = useAdminOrders()

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-muted" />
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-md border border-border py-20 text-center">
        <p className="text-lg text-foreground">No rental orders</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Customer
            </th>
            <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Gear
            </th>
            <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Period
            </th>
            <th className="px-5 py-3 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Qty
            </th>
            <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Total
            </th>
            <th className="px-5 py-3 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Order Status
            </th>
            <th className="px-5 py-3 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Payment
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => {
            const paymentStatus = order.payments?.[0]?.status
            return (
              <tr key={order.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-4">
                  <p>{order.customer?.name ?? "—"}</p>
                  {order.customer?.email && (
                    <p className="text-xs text-muted-foreground">
                      {order.customer.email}
                    </p>
                  )}
                </td>
                <td className="px-5 py-4 font-medium">
                  <Link
                    href={`/gears/${order.gearItem?.id}`}
                    className="hover:underline"
                  >
                    {order.gearItem?.name ?? "Gear"}
                  </Link>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(order.startDate)} – {formatDate(order.endDate)}
                </td>
                <td className="px-5 py-4 text-center">x{order.quantity}</td>
                <td className="px-5 py-4 text-right font-heading font-bold">
                  ${Number(order.totalPrice).toLocaleString()}
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${STATUS_STYLES[order.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
                  >
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  {paymentStatus ? (
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${PAYMENT_STATUS_STYLES[paymentStatus] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
                    >
                      {PAYMENT_STATUS_LABELS[paymentStatus] || paymentStatus}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
