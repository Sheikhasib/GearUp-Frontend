"use client"

import { Banknotes, CheckCircle, Clock, XCircle } from "@phosphor-icons/react"
import type { IPayment } from "@/lib/types"

interface PaymentSummaryCardsProps {
  payments: IPayment[]
}

export function PaymentSummaryCards({ payments }: PaymentSummaryCardsProps) {
  const paid = payments.filter((p) => p.status === "PAID")
  const totalSpent = paid.reduce((sum, p) => sum + p.amount, 0)

  const stats = [
    {
      label: "Total Spent",
      value: `$${totalSpent.toLocaleString()}`,
      icon: Banknotes,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Successful",
      value: String(paid.length),
      icon: CheckCircle,
      iconClass: "bg-green-500/10 text-green-600",
    },
    {
      label: "Pending",
      value: String(payments.filter((p) => p.status === "PENDING").length),
      icon: Clock,
      iconClass: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "Failed",
      value: String(payments.filter((p) => p.status === "FAILED").length),
      icon: XCircle,
      iconClass: "bg-red-500/10 text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-md border border-border bg-card p-5"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${stat.iconClass}`}
          >
            <stat.icon size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">
              {stat.label}
            </p>
            <p className="font-heading text-xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
