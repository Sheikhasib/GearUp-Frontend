"use client"

import { useMemo, type ComponentType } from "react"
import Link from "next/link"
import {
  Bank,
  Receipt,
  CurrencyCircleDollar,
  GearSix,
  ArrowRight,
} from "@phosphor-icons/react"
import { useAdminAnalytics } from "../../_hooks/useAnalytics"
import type { IAnalyticsOverview } from "@/lib/types"
import { ChartCard } from "@/components/charts/ChartCard"
import { RevenueLineChart } from "@/components/charts/RevenueLineChart"
import { StatusDonutChart } from "@/components/charts/StatusDonutChart"
import { CategoryBarChart } from "@/components/charts/CategoryBarChart"
import { UsersByRoleChart } from "@/components/charts/UsersByRoleChart"

const KPI_CARDS: {
  key: keyof ReturnType<typeof buildKpis>
  label: string
  href: string
  icon: ComponentType<{ size?: number | string }>
  prefix?: string
}[] = [
  {
    key: "totalRevenue",
    label: "Total Revenue",
    href: "/admin-dashboard/orders",
    icon: CurrencyCircleDollar,
    prefix: "$",
  },
  {
    key: "totalRentals",
    label: "Total Orders",
    href: "/admin-dashboard/orders",
    icon: Receipt,
  },
  {
    key: "averageOrderValue",
    label: "Avg. Order Value",
    href: "/admin-dashboard/orders",
    icon: Bank,
    prefix: "$",
  },
  {
    key: "activeGear",
    label: "Active Gear",
    href: "/admin-dashboard/gear",
    icon: GearSix,
  },
]

function buildKpis(overview: IAnalyticsOverview | undefined) {
  const revenue = overview?.totalRevenue ?? 0
  const rentals = overview?.totalRentals ?? 0
  return {
    totalRevenue: revenue,
    totalRentals: rentals,
    averageOrderValue: rentals > 0 ? revenue / rentals : 0,
    activeGear: overview?.activeGear ?? 0,
  }
}

function formatValue(prefix: string | undefined, value: number) {
  return `${prefix ?? ""}${value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`
}

export default function AdminAnalyticsPage() {
  const {
    overview,
    ordersByStatus,
    revenueOverTime,
    gearByCategory,
    usersByRole,
    isLoading,
    isError,
  } = useAdminAnalytics()

  const kpis = useMemo(() => buildKpis(overview), [overview])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform performance
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon
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
                  {isLoading ? "–" : formatValue(card.prefix, kpis[card.key])}
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Revenue Over Time"
          description="Paid revenue, last 30 days"
          loading={isLoading}
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
          loading={isLoading}
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
          loading={isLoading}
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
          loading={isLoading}
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
