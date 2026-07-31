"use client"

import Link from "next/link"
import { Users, GearSix, Receipt, ArrowRight } from "@phosphor-icons/react"
import { useAdminUsers, useAdminGears, useAdminOrders } from "../../_hooks/useAdmin"

const STAT_CARDS = [
  {
    key: "totalUsers",
    label: "Total Users",
    href: "/admin-dashboard/users",
    icon: Users,
  },
  {
    key: "activeGear",
    label: "Active Gear",
    href: "/admin-dashboard/gear",
    icon: GearSix,
  },
  {
    key: "totalRentals",
    label: "Total Rentals",
    href: "/admin-dashboard/orders",
    icon: Receipt,
  },
] as const

export function AdminOverviewClient() {
  const { data: users, isLoading: isLoadingUsers } = useAdminUsers()
  const { data: gears, isLoading: isLoadingGears } = useAdminGears()
  const { data: orders, isLoading: isLoadingOrders } = useAdminOrders()

  const stats = {
    totalUsers: users?.length ?? 0,
    activeGear: gears?.filter((gear) => gear.isAvailable).length ?? 0,
    totalRentals: orders?.length ?? 0,
  }

  if (isLoadingUsers || isLoadingGears || isLoadingOrders) {
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
