"use client"

import Link from "next/link"
import { useCustomerPayments } from "../../_hooks/useCustomerPayments"
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  cleanMethodLabel,
} from "@/lib/badgeStyles"
import { CardField } from "@/components/shared/card-field"

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

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-muted" />
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="rounded-md border border-border py-20 text-center">
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
    <>
      <div className="hidden overflow-x-auto rounded-md border border-border bg-card sm:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Payment
              </th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Date
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Amount
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((payment) => (
              <tr key={payment.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-4">
                  <p className="font-medium">{cleanMethodLabel(payment.method) || "—"}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {payment.tranId}
                  </p>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(payment.paidAt)}
                </td>
                <td className="px-5 py-4 text-right font-heading font-bold">
                  ${payment.amount.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${PAYMENT_STATUS_STYLES[payment.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
                  >
                    {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {payments.map((payment) => (
          <div key={payment.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{cleanMethodLabel(payment.method) || "—"}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  {payment.tranId}
                </p>
              </div>
              <span
                className={`inline-block shrink-0 px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${PAYMENT_STATUS_STYLES[payment.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
              >
                {PAYMENT_STATUS_LABELS[payment.status] || payment.status}
              </span>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-3">
              <CardField label="Date">{formatDate(payment.paidAt)}</CardField>
              <CardField label="Amount">
                ${payment.amount.toLocaleString()}
              </CardField>
            </dl>
          </div>
        ))}
      </div>
    </>
  )
}
