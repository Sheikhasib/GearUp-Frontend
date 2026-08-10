"use client"

import { useQuery } from "@tanstack/react-query"
import {
  fetchAdminAnalyticsOverview,
  fetchAdminGearByCategory,
  fetchAdminOrdersByStatus,
  fetchAdminRevenueOverTime,
  fetchAdminUsersByRole,
  fetchProviderAnalyticsOverview,
  fetchProviderOrdersByStatus,
  fetchProviderRevenueOverTime,
} from "@/lib/api/analytics"
import type {
  IAnalyticsOverview,
  IGearByCategory,
  IOrdersByStatus,
  IRevenuePoint,
  IUsersByRole,
} from "@/lib/types"

export function useAdminAnalyticsOverview() {
  return useQuery({
    queryKey: ["admin-analytics-overview"],
    queryFn: fetchAdminAnalyticsOverview,
  })
}

export function useAdminOrdersByStatus() {
  return useQuery({
    queryKey: ["admin-analytics-orders-by-status"],
    queryFn: fetchAdminOrdersByStatus,
  })
}

export function useAdminRevenueOverTime(days?: number) {
  return useQuery({
    queryKey: ["admin-analytics-revenue-over-time", days ?? 30],
    queryFn: () => fetchAdminRevenueOverTime(days),
  })
}

export function useAdminGearByCategory() {
  return useQuery({
    queryKey: ["admin-analytics-gear-by-category"],
    queryFn: fetchAdminGearByCategory,
  })
}

export function useAdminUsersByRole() {
  return useQuery({
    queryKey: ["admin-analytics-users-by-role"],
    queryFn: fetchAdminUsersByRole,
  })
}

export type AdminAnalyticsData = {
  overview: IAnalyticsOverview | undefined
  ordersByStatus: IOrdersByStatus[]
  revenueOverTime: IRevenuePoint[]
  gearByCategory: IGearByCategory[]
  usersByRole: IUsersByRole[]
  isLoading: boolean
  isError: boolean
  refetch: () => Promise<unknown>
}

type AdminAnalyticsQueryResult = {
  ordersByStatus: IOrdersByStatus[]
  revenueOverTime: IRevenuePoint[]
  gearByCategory: IGearByCategory[]
  usersByRole: IUsersByRole[]
}

export function useAdminAnalytics(days?: number): AdminAnalyticsData {
  const overviewQuery = useAdminAnalyticsOverview()
  const chartsQuery = useQuery({
    queryKey: ["admin-analytics", days ?? 30],
    queryFn: async () => {
      const [ordersByStatus, revenueOverTime, gearByCategory, usersByRole] =
        await Promise.all([
          fetchAdminOrdersByStatus(),
          fetchAdminRevenueOverTime(days),
          fetchAdminGearByCategory(),
          fetchAdminUsersByRole(),
        ])
      return { ordersByStatus, revenueOverTime, gearByCategory, usersByRole }
    },
  })

  const data = chartsQuery.data as AdminAnalyticsQueryResult | undefined

  return {
    overview: overviewQuery.data,
    ordersByStatus: data?.ordersByStatus ?? [],
    revenueOverTime: data?.revenueOverTime ?? [],
    gearByCategory: data?.gearByCategory ?? [],
    usersByRole: data?.usersByRole ?? [],
    isLoading: overviewQuery.isLoading || chartsQuery.isLoading,
    isError: overviewQuery.isError || chartsQuery.isError,
    refetch: async () => {
      await Promise.all([overviewQuery.refetch(), chartsQuery.refetch()])
    },
  }
}

export function useProviderAnalyticsOverview() {
  return useQuery({
    queryKey: ["provider-analytics-overview"],
    queryFn: fetchProviderAnalyticsOverview,
  })
}

export function useProviderOrdersByStatus() {
  return useQuery({
    queryKey: ["provider-analytics-orders-by-status"],
    queryFn: fetchProviderOrdersByStatus,
  })
}

export function useProviderRevenueOverTime(days?: number) {
  return useQuery({
    queryKey: ["provider-analytics-revenue-over-time", days ?? 30],
    queryFn: () => fetchProviderRevenueOverTime(days),
  })
}
