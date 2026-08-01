"use client"

import Link from "next/link"
import {
  GearSix,
  Timer,
  Truck,
  ArrowRight,
} from "@phosphor-icons/react"
import { useMyGear, useIncomingOrders } from "../../_hooks/useProvider"
import { ACTIVE_RENTAL_STATUSES } from "@/lib/orderTransitions"

const STAT_CARDS = [
  {
    key: "totalGear",
    label: "Total Gear",
    href: "/provider-dashboard/my-gear",
    icon: GearSix,
  },
  {
    key: "activeRentals",
    label: "Active Rentals",
    href: "/provider-dashboard/orders?status=active",
    icon: Truck,
  },
  {
    key: "pendingOrders",
    label: "Pending Orders",
    href: "/provider-dashboard/orders?status=PLACED",
    icon: Timer,
  },
] as const

export function ProviderOverviewClient() {
  const { data: gears, isLoading: isLoadingGear } = useMyGear()
  const { data: orders, isLoading: isLoadingOrders } = useIncomingOrders()

  const stats = {
    totalGear: gears?.length ?? 0,
    activeRentals:
      orders?.filter((order) => ACTIVE_RENTAL_STATUSES.includes(order.status))
        .length ?? 0,
    pendingOrders:
      orders?.filter((order) => order.status === "PLACED").length ?? 0,
  }

  if (isLoadingGear || isLoadingOrders) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon
        const value = stats[card.key]
        return (
          <Link
            key={card.key}
            href={card.href}
            className="group flex items-center gap-4 rounded-md border border-border bg-card p-6 transition-colors hover:bg-muted/50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon size={24} />
            </div>
            <div className="flex-1">
              <p className="font-heading text-3xl font-bold tracking-tight">
                {value}
              </p>
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {card.label}
              </p>
            </div>
            <ArrowRight className="text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        )
      })}
    </div>
  )
}
