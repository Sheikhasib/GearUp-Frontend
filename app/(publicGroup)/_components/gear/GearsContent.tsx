"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useGear } from "../../_hooks/useGear"
import { GearFilters } from "./GearFilters"
import { GearGrid } from "./GearGrid"
import { Pagination } from "@/components/shared/pagination"
import type { IGearItem } from "@/lib/types"

interface GearsContentProps {
  initialData: IGearItem[]
  initialTotalPages?: number
  initialParams: Record<string, string>
  initialBrands?: string[]
}

export function GearsContent({
  initialData,
  initialTotalPages,
  initialParams,
  initialBrands = [],
}: GearsContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("search") || initialParams.search || ""
  const currentCategory = searchParams.get("categoryId") || initialParams.categoryId || ""
  const currentBrand = searchParams.get("brand") || initialParams.brand || ""
  const currentMinPrice = searchParams.get("minPrice") || initialParams.minPrice || ""
  const currentMaxPrice = searchParams.get("maxPrice") || initialParams.maxPrice || ""
  const currentAvailFrom = searchParams.get("availableFrom") || initialParams.availableFrom || ""
  const currentAvailTo = searchParams.get("availableTo") || initialParams.availableTo || ""
  const currentSortBy = searchParams.get("sortBy") || initialParams.sortBy || "createdAt"
  const currentSortOrder = (searchParams.get("sortOrder") || initialParams.sortOrder || "desc") as "asc" | "desc"
  const currentPage = Math.max(
    1,
    Number(searchParams.get("page") || initialParams.page) || 1
  )

  const { data, isLoading } = useGear({
    searchTerm: currentSearch || undefined,
    categoryId: currentCategory || undefined,
    brand: currentBrand || undefined,
    minPrice: currentMinPrice ? Number(currentMinPrice) : undefined,
    maxPrice: currentMaxPrice ? Number(currentMaxPrice) : undefined,
    availableFrom: currentAvailFrom || undefined,
    availableTo: currentAvailTo || undefined,
    page: currentPage,
    limit: 12,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
  })

  const gears: IGearItem[] = data?.items ?? initialData
  const totalPages = Math.max(1, data?.meta?.totalPages ?? initialTotalPages ?? 1)

  const brands = initialBrands

  const handleParamsChange = useCallback(
    (patch: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(patch).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      params.delete("page")
      const qs = params.toString()
      router.push(`/gears${qs ? `?${qs}` : ""}`, { scroll: false })
    },
    [router, searchParams]
  )

  const handlePageChange = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString())
      if (nextPage <= 1) {
        params.delete("page")
      } else {
        params.set("page", String(nextPage))
      }
      const qs = params.toString()
      router.push(`/gears${qs ? `?${qs}` : ""}`, { scroll: true })
    },
    [router, searchParams]
  )

  return (
    <div className="space-y-8">
      <GearFilters
        params={{
          search: currentSearch,
          categoryId: currentCategory,
          brand: currentBrand,
          minPrice: currentMinPrice,
          maxPrice: currentMaxPrice,
          availableFrom: currentAvailFrom,
          availableTo: currentAvailTo,
          sortBy: currentSortBy,
          sortOrder: currentSortOrder,
        }}
        brands={brands}
        onParamsChange={handleParamsChange}
      />
      <GearGrid gears={gears} isLoading={isLoading} />
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
