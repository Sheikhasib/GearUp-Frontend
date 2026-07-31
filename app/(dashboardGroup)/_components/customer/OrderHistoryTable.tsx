"use client"

import { useState } from "react"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { useCustomerOrders } from "../../_hooks/useCustomerOrders"
import { useCancelRental } from "../../_hooks/useCancelRental"
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/badgeStyles"
import { ReviewDialog } from "./ReviewDialog"
import { Button } from "@/components/ui/button"
import { CardField } from "@/components/shared/card-field"

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export function OrderHistoryTable() {
  const { data: orders, isLoading } = useCustomerOrders()
  const queryClient = useQueryClient()
  const [reviewTarget, setReviewTarget] = useState<{
    id: string
    name: string
  } | null>(null)
  const [reviewedOrderIds, setReviewedOrderIds] = useState<Set<string>>(
    () => new Set()
  )
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const { mutate: cancelOrder } = useCancelRental()

  const handleReviewSuccess = (orderId: string) => {
    setReviewedOrderIds((prev) => new Set(prev).add(orderId))
    queryClient.invalidateQueries({ queryKey: ["customer-orders"] })
  }

  const handleCancel = (id: string) => {
    setCancellingId(id)
    cancelOrder(id, {
      onSettled: () => setCancellingId(null),
    })
  }

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-muted" />
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-md border border-border py-20 text-center">
        <p className="text-lg text-foreground">No orders yet</p>
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
    <>
      <div className="hidden overflow-x-auto rounded-md border border-border bg-card sm:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
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
                Status
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-4 font-medium">
                  {order.gearItem?.name ?? "Gear"}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(order.startDate)} – {formatDate(order.endDate)}
                </td>
                <td className="px-5 py-4 text-center">x{order.quantity}</td>
                <td className="px-5 py-4 text-right font-heading font-bold">
                  ${order.totalPrice.toLocaleString()}
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
                    {order.status === "CONFIRMED" && (
                      <Link
                        href={`/customer-dashboard/orders/${order.id}/pay`}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Pay Now
                      </Link>
                    )}
                    {order.status === "PLACED" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancel(order.id)}
                      >
                        {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                      </Button>
                    )}
                    {order.status === "RETURNED" &&
                      !order.review &&
                      !reviewedOrderIds.has(order.id) && (
                        <button
                          type="button"
                          onClick={() =>
                            setReviewTarget({
                              id: order.id,
                              name: order.gearItem?.name ?? "Gear",
                            })
                          }
                          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
                        >
                          Leave Review
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {orders.map((order) => (
          <div key={order.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">{order.gearItem?.name ?? "Gear"}</p>
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
                ${order.totalPrice.toLocaleString()}
              </CardField>
            </dl>

            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
              {order.status === "CONFIRMED" && (
                <Link
                  href={`/customer-dashboard/orders/${order.id}/pay`}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Pay Now
                </Link>
              )}
              {order.status === "PLACED" && (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={cancellingId === order.id}
                  onClick={() => handleCancel(order.id)}
                >
                  {cancellingId === order.id ? "Cancelling..." : "Cancel"}
                </Button>
              )}
              {order.status === "RETURNED" &&
                !order.review &&
                !reviewedOrderIds.has(order.id) && (
                  <button
                    type="button"
                    onClick={() =>
                      setReviewTarget({
                        id: order.id,
                        name: order.gearItem?.name ?? "Gear",
                      })
                    }
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
                  >
                    Leave Review
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>

      <ReviewDialog
        open={!!reviewTarget}
        onOpenChange={(open) => {
          if (!open) setReviewTarget(null)
        }}
        rentalOrderId={reviewTarget?.id ?? ""}
        gearItemName={reviewTarget?.name ?? ""}
        onSuccess={() => handleReviewSuccess(reviewTarget?.id ?? "")}
      />
    </>
  )
}
