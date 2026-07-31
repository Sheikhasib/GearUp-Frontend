"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Check, CopySimple } from "@phosphor-icons/react"
import { useCustomerPayments } from "../../_hooks/useCustomerPayments"
import { PAYMENT_STATUS_LABELS, PAYMENT_STATUS_STYLES } from "@/lib/badgeStyles"
import { PaymentSummaryCards } from "./PaymentSummaryCards"
import { getPaymentMethodMeta } from "./paymentMethod"

const formatDate = (value?: string) => {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function PaymentHistoryTable() {
  const { data: payments, isLoading } = useCustomerPayments()
  const [copiedTranId, setCopiedTranId] = useState<string | null>(null)

  const handleCopy = async (tranId: string) => {
    try {
      await navigator.clipboard.writeText(tranId)
      setCopiedTranId(tranId)
      toast.success("Transaction ID copied")
      setTimeout(() => setCopiedTranId(null), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card py-20 text-center">
        <p className="text-lg text-foreground">No payments yet</p>
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
    <div className="space-y-6">
      <PaymentSummaryCards payments={payments} />

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="hidden grid-cols-[1fr_auto_auto_auto] items-center gap-6 border-b border-border bg-muted/40 px-5 py-3 sm:grid">
          <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Payment
          </span>
          <span className="w-28 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Date
          </span>
          <span className="w-28 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Amount
          </span>
          <span className="w-24 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Status
          </span>
        </div>

        <div className="divide-y divide-border">
          {payments.map((payment) => {
            const { icon: MethodIcon, label } = getPaymentMethodMeta(
              payment.method
            )

            return (
              <div
                key={payment.id}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <MethodIcon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{label}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-mono text-xs text-muted-foreground">
                        {payment.tranId}
                      </span>
                      <button
                        type="button"
                        aria-label="Copy transaction ID"
                        onClick={() => handleCopy(payment.tranId)}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                      >
                        {copiedTranId === payment.tranId ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <CopySimple size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <span className="text-sm text-muted-foreground sm:w-28">
                  {formatDate(payment.paidAt)}
                </span>

                <span className="font-heading text-lg font-bold sm:w-28 sm:text-right">
                  ${payment.amount.toLocaleString()}
                </span>

                <span
                  className={`w-fit px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 sm:ml-auto sm:w-24 sm:text-center ${PAYMENT_STATUS_STYLES[payment.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
                >
                  {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
