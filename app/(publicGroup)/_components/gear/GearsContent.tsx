"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useGear } from "../../_hooks/useGear"
import { GearFilters } from "./GearFilters"
import { GearGrid } from "./GearGrid"
import type { IGearItem } from "@/lib/types"

interface GearsContentProps {
  initialData: IGearItem[]
  initialParams: Record<string, string>
}

export function GearsContent({ initialData, initialParams }: GearsContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("search") || initialParams.search || ""
  const currentCategory = searchParams.get("categoryId") || initialParams.categoryId || ""
  const currentBrand = searchParams.get("brand") || initialParams.brand || ""
  const currentMinPrice = searchParams.get("minPrice") || initialParams.minPrice || ""
  const currentMaxPrice = searchParams.get("maxPrice") || initialParams.maxPrice || ""
  const currentAvailFrom = searchParams.get("availableFrom") || initialParams.availableFrom || ""
  const currentAvailTo = searchParams.get("availableTo") || initialParams.availableTo || ""

  const { data, isLoading } = useGear({
    searchTerm: currentSearch || undefined,
    categoryId: currentCategory || undefined,
    brand: currentBrand || undefined,
    minPrice: currentMinPrice ? Number(currentMinPrice) : undefined,
    maxPrice: currentMaxPrice ? Number(currentMaxPrice) : undefined,
    availableFrom: currentAvailFrom || undefined,
    availableTo: currentAvailTo || undefined,
    limit: 12,
  })

  const gears: IGearItem[] = data ?? initialData

  const brands = Array.from(
    new Set(gears.map((gear) => gear.brand).filter((brand): brand is string => !!brand))
  )

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
      const qs = params.toString()
      router.push(`/gears${qs ? `?${qs}` : ""}`, { scroll: false })
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
        }}
        brands={brands}
        onParamsChange={handleParamsChange}
      />
      <GearGrid gears={gears} isLoading={isLoading} />
    </div>
  )
}
