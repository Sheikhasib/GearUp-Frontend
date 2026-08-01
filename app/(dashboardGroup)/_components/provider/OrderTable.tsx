"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useIncomingOrders, useUpdateOrderStatus } from "../../_hooks/useProvider"
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/badgeStyles"
import {
  ORDER_TRANSITIONS,
  ORDER_CANCELLATIONS,
  ACTIVE_RENTAL_STATUSES,
} from "@/lib/orderTransitions"
import type { RentalStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CardField } from "@/components/shared/card-field"
import { Pagination } from "@/components/shared/pagination"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 10

const ORDER_STATUSES: RentalStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
  "RETURNED",
  "CANCELLED",
]

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "PLACED", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
] as const

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export function OrderTable() {
  const { data: orders, isLoading } = useIncomingOrders()
  const { mutate: updateStatus } = useUpdateOrderStatus()
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const router = useRouter()
  const searchParams = useSearchParams()

  const statusParam = searchParams.get("status")
  const activeFilter = statusParam === "active"
  const completedFilter = statusParam === "completed"
  const statusFilter =
    statusParam && (ORDER_STATUSES as string[]).includes(statusParam)
      ? (statusParam as RentalStatus)
      : null
  const currentFilter = statusFilter ?? (activeFilter ? "active" : completedFilter ? "completed" : "all")

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-muted" />
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-md border border-border py-20 text-center">
        <p className="text-lg text-foreground">No rental orders yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Orders appear here once customers book your gear.
        </p>
      </div>
    )
  }

  const handleStatusChange = (id: string, status: RentalStatus) => {
    setPendingOrderId(id)
    updateStatus(
      { id, status },
      {
        onSuccess: () => {
          toast.success(status === "CANCELLED" ? "Order cancelled" : "Order updated")
        },
        onSettled: () => {
          setPendingOrderId(null)
        },
      }
    )
  }

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (filter === "all") params.delete("status")
    else params.set("status", filter)
    setPage(1)
    const qs = params.toString()
    router.replace(`/provider-dashboard/orders${qs ? `?${qs}` : ""}`, {
      scroll: false,
    })
  }

  const filtered = orders.filter((order) => {
    if (activeFilter) return ACTIVE_RENTAL_STATUSES.includes(order.status)
    if (completedFilter) return order.status === "RETURNED" || order.status === "CANCELLED"
    if (statusFilter) return order.status === statusFilter
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const filterTabs = (
    <div className="mb-4 flex flex-wrap gap-2">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => handleFilterChange(tab.key)}
          className={cn(
            "inline-flex h-8 cursor-pointer items-center rounded-md border px-3 text-xs font-semibold tracking-widest uppercase transition-colors",
            currentFilter === tab.key
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )

  if (filtered.length === 0) {
    return (
      <>
        {filterTabs}
        <div className="rounded-md border border-border py-20 text-center">
          <p className="text-lg text-foreground">No orders match this view</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different filter.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      {filterTabs}
      <div className="hidden overflow-x-auto rounded-md border border-border bg-card sm:block">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Gear
              </th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Customer
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
                Status
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paged.map((order) => {
              const transition = ORDER_TRANSITIONS[order.status]
              const cancellation = ORDER_CANCELLATIONS[order.status]
              return (
                <tr key={order.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-4 font-medium">
                    <Link
                      href={`/gears/${order.gearItem?.id}`}
                      className="hover:underline"
                    >
                      {order.gearItem?.name ?? "Gear"}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p>{order.customer?.name ?? "—"}</p>
                    {order.customer?.phone && (
                      <p className="text-xs text-muted-foreground">
                        {order.customer.phone}
                      </p>
                    )}
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
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {transition && (
                        <Button
                          size="sm"
                          disabled={pendingOrderId === order.id}
                          onClick={() =>
                            handleStatusChange(order.id, transition.next)
                          }
                        >
                          {pendingOrderId === order.id
                            ? "Updating..."
                            : transition.label}
                        </Button>
                      )}
                      {cancellation && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-600"
                          disabled={pendingOrderId === order.id}
                          onClick={() =>
                            handleStatusChange(order.id, cancellation.next)
                          }
                        >
                          {pendingOrderId === order.id
                            ? "Updating..."
                            : cancellation.label}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {paged.map((order) => {
          const transition = ORDER_TRANSITIONS[order.status]
          const cancellation = ORDER_CANCELLATIONS[order.status]
          return (
            <div
              key={order.id}
              className="rounded-md border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/gears/${order.gearItem?.id}`}
                    className="font-medium hover:underline"
                  >
                    {order.gearItem?.name ?? "Gear"}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {order.customer?.name ?? "—"}
                    {order.customer?.phone
                      ? ` · ${order.customer.phone}`
                      : ""}
                  </p>
                </div>
                <span
                  className={`inline-block shrink-0 px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${STATUS_STYLES[order.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
                >
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-3">
                <CardField label="Period">
                  {formatDate(order.startDate)} – {formatDate(order.endDate)}
                </CardField>
                <CardField label="Qty">x{order.quantity}</CardField>
                <CardField label="Total">
                  ${Number(order.totalPrice).toLocaleString()}
                </CardField>
              </dl>

              {(transition || cancellation) && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                  {transition && (
                    <Button
                      size="sm"
                      disabled={pendingOrderId === order.id}
                      onClick={() =>
                        handleStatusChange(order.id, transition.next)
                      }
                    >
                      {pendingOrderId === order.id
                        ? "Updating..."
                        : transition.label}
                    </Button>
                  )}
                  {cancellation && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-600"
                      disabled={pendingOrderId === order.id}
                      onClick={() =>
                        handleStatusChange(order.id, cancellation.next)
                      }
                    >
                      {pendingOrderId === order.id
                        ? "Updating..."
                        : cancellation.label}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  )
}
