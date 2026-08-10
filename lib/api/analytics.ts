import { apiClient } from "./client"
import type {
  IAnalyticsOverview,
  IGearByCategory,
  IOrdersByStatus,
  IRevenuePoint,
  IUsersByRole,
} from "@/lib/types"

export async function fetchAdminAnalyticsOverview(): Promise<IAnalyticsOverview> {
  return apiClient<IAnalyticsOverview>("/admin/analytics/overview")
}

export async function fetchAdminOrdersByStatus(): Promise<IOrdersByStatus[]> {
  return apiClient<IOrdersByStatus[]>("/admin/analytics/orders-by-status")
}

export async function fetchAdminRevenueOverTime(
  days?: number
): Promise<IRevenuePoint[]> {
  return apiClient<IRevenuePoint[]>(
    `/admin/analytics/revenue-over-time${days ? `?days=${days}` : ""}`
  )
}

export async function fetchAdminGearByCategory(): Promise<IGearByCategory[]> {
  return apiClient<IGearByCategory[]>("/admin/analytics/gear-by-category")
}

export async function fetchAdminUsersByRole(): Promise<IUsersByRole[]> {
  return apiClient<IUsersByRole[]>("/admin/analytics/users-by-role")
}

export async function fetchProviderAnalyticsOverview(): Promise<IAnalyticsOverview> {
  return apiClient<IAnalyticsOverview>("/provider/analytics/overview")
}

export async function fetchProviderOrdersByStatus(): Promise<
  IOrdersByStatus[]
> {
  return apiClient<IOrdersByStatus[]>("/provider/analytics/orders-by-status")
}

export async function fetchProviderRevenueOverTime(
  days?: number
): Promise<IRevenuePoint[]> {
  return apiClient<IRevenuePoint[]>(
    `/provider/analytics/revenue-over-time${days ? `?days=${days}` : ""}`
  )
}
