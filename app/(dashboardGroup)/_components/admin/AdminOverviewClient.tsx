"use client"

import Link from "next/link"
import {
  Users,
  GearSix,
  Receipt,
  SquaresFour,
  ArrowRight,
} from "@phosphor-icons/react"
import {
  useAdminAnalyticsOverview,
  useAdminAnalytics,
} from "../../_hooks/useAnalytics"
import { ChartCard } from "@/components/charts/ChartCard"
import { RevenueLineChart } from "@/components/charts/RevenueLineChart"
import { StatusDonutChart } from "@/components/charts/StatusDonutChart"
import { CategoryBarChart } from "@/components/charts/CategoryBarChart"
import { UsersByRoleChart } from "@/components/charts/UsersByRoleChart"

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
  {
    key: "totalCategories",
    label: "Categories",
    href: "/admin-dashboard/categories",
    icon: SquaresFour,
  },
] as const

export function AdminOverviewClient() {
  const { data: overview, isLoading: overviewLoading } =
    useAdminAnalyticsOverview()
  const {
    revenueOverTime,
    ordersByStatus,
    gearByCategory,
    usersByRole,
    isLoading: chartsLoading,
    isError,
  } = useAdminAnalytics()

  const isLoading = overviewLoading || chartsLoading

  const stats = {
    totalUsers: overview?.totalUsers ?? 0,
    activeGear: overview?.activeGear ?? 0,
    totalRentals: overview?.totalRentals ?? 0,
    totalCategories: overview?.totalCategories ?? 0,
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
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

      <div className="mt-6 grid gap-6 sm:col-span-2 lg:grid-cols-2">
        <ChartCard
          title="Revenue Over Time"
          description="Paid revenue, last 30 days"
          loading={chartsLoading}
          error={isError}
          empty={revenueOverTime.length === 0}
        >
          <div className="h-64">
            <RevenueLineChart data={revenueOverTime} />
          </div>
        </ChartCard>

        <ChartCard
          title="Orders by Status"
          description="Rental orders per status"
          loading={chartsLoading}
          error={isError}
          empty={ordersByStatus.length === 0}
        >
          <div className="h-64">
            <StatusDonutChart data={ordersByStatus} />
          </div>
        </ChartCard>

        <ChartCard
          title="Gear by Category"
          description="Listings per category"
          loading={chartsLoading}
          error={isError}
          empty={gearByCategory.length === 0}
        >
          <div className="h-64">
            <CategoryBarChart data={gearByCategory} />
          </div>
        </ChartCard>

        <ChartCard
          title="Users by Role"
          description="Registered users per role"
          loading={chartsLoading}
          error={isError}
          empty={usersByRole.length === 0}
        >
          <div className="h-64">
            <UsersByRoleChart data={usersByRole} />
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
