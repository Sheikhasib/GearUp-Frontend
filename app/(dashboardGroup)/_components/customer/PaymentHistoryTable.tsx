"use client"

import { useCustomerPayments } from "../../_hooks/useCustomerPayments"
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_STYLES } from "@/lib/badgeStyles"

export function PaymentHistoryTable() {
  const { data: payments, isLoading } = useCustomerPayments()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <p className="text-lg">No payments yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="flex flex-col justify-between gap-4 bg-card p-5 ring-1 ring-foreground/5 sm:flex-row sm:items-center"
        >
          <div className="min-w-0 space-y-1">
            <p className="truncate font-mono text-xs text-muted-foreground">
              {payment.tranId}
            </p>
            <div className="flex flex-wrap gap-x-4 text-sm">
              <span className="font-heading font-semibold">
                ${payment.amount.toLocaleString()}
              </span>
              {payment.method && (
                <span className="text-muted-foreground">{payment.method}</span>
              )}
              {payment.paidAt && (
                <span className="text-muted-foreground">
                  {new Date(payment.paidAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <span
            className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${PAYMENT_STATUS_STYLES[payment.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
          >
            {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
          </span>
        </div>
      ))}
    </div>
  )
}
