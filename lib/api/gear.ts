import { apiClient, apiClientFull } from "./client"
import type { IGearItem, IGearQuery, IApiResponse } from "@/lib/types"

export interface IGearListResult {
  items: IGearItem[]
  meta?: IApiResponse<IGearItem[]>["meta"]
}

export async function fetchGear(query?: IGearQuery): Promise<IGearListResult> {
  const params = new URLSearchParams()
  if (query?.searchTerm) params.set("searchTerm", query.searchTerm)
  if (query?.categoryId) params.set("categoryId", query.categoryId)
  if (query?.brand) params.set("brand", query.brand)
  if (query?.minPrice) params.set("minPrice", String(query.minPrice))
  if (query?.maxPrice) params.set("maxPrice", String(query.maxPrice))
  if (query?.availableFrom) params.set("availableFrom", query.availableFrom)
  if (query?.availableTo) params.set("availableTo", query.availableTo)
  if (query?.page) params.set("page", String(query.page))
  if (query?.limit) params.set("limit", String(query.limit))
  if (query?.sortBy) params.set("sortBy", query.sortBy)
  if (query?.sortOrder) params.set("sortOrder", query.sortOrder)

  const qs = params.toString()
  const res = await apiClientFull<IGearItem[]>(`/gear${qs ? `?${qs}` : ""}`)
  return { items: res.data, meta: res.meta }
}

export async function fetchGearById(id: string): Promise<IGearItem> {
  return apiClient(`/gear/${id}`)
}
