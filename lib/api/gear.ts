import { apiClient } from "./client"
import type { IGearItem, IGearQuery, IApiResponse } from "@/lib/types"

export async function fetchGear(
  query?: IGearQuery
): Promise<IApiResponse<IGearItem[]>> {
  const params = new URLSearchParams()
  if (query?.searchTerm) params.set("searchTerm", query.searchTerm)
  if (query?.categoryId) params.set("categoryId", query.categoryId)
  if (query?.brand) params.set("brand", query.brand)
  if (query?.minPrice) params.set("minPrice", String(query.minPrice))
  if (query?.maxPrice) params.set("maxPrice", String(query.maxPrice))
  if (query?.page) params.set("page", String(query.page))
  if (query?.limit) params.set("limit", String(query.limit))
  if (query?.sortBy) params.set("sortBy", query.sortBy)
  if (query?.sortOrder) params.set("sortOrder", query.sortOrder)

  const qs = params.toString()
  return apiClient(`/gear${qs ? `?${qs}` : ""}`)
}

export async function fetchGearById(id: string): Promise<IGearItem> {
  return apiClient(`/gear/${id}`)
}
