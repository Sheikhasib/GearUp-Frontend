"use client"

import { useState, useEffect, useCallback } from "react"
import { useCategories } from "@/hooks/useCategories"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface GearFiltersProps {
  params: {
    search?: string
    categoryId?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    availableFrom?: string
    availableTo?: string
    sortBy?: string
    sortOrder?: string
  }
  brands?: string[]
  onParamsChange: (params: Record<string, string>) => void
}

export function GearFilters({ params, brands = [], onParamsChange }: GearFiltersProps) {
  const { data: categories } = useCategories()
  const [search, setSearch] = useState(params.search || "")
  const [minPrice, setMinPrice] = useState(params.minPrice || "")
  const [maxPrice, setMaxPrice] = useState(params.maxPrice || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (params.search || "")) {
        onParamsChange({ search })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (minPrice !== (params.minPrice || "")) {
        onParamsChange({ minPrice })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [minPrice])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (maxPrice !== (params.maxPrice || "")) {
        onParamsChange({ maxPrice })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [maxPrice])

  const updateParam = useCallback(
    (key: string, value: string) => {
      onParamsChange({ [key]: value })
    },
    [onParamsChange]
  )

  const hasActiveFilters = Boolean(
    search || minPrice || maxPrice ||
    params.categoryId || params.brand ||
    params.availableFrom || params.availableTo
  )

  const handleClearAll = useCallback(() => {
    setSearch("")
    setMinPrice("")
    setMaxPrice("")
    onParamsChange({
      search: "",
      categoryId: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      availableFrom: "",
      availableTo: "",
    })
  }, [onParamsChange])

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4 overflow-x-auto pb-1 [scrollbar-width:thin]">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Search
        </label>
        <Input
          placeholder="Search gear..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-36 shrink-0">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Category
        </label>
        <select
          value={params.categoryId || ""}
          onChange={(e) => updateParam("categoryId", e.target.value)}
          className={cn(
            "h-10 w-full bg-transparent border-0 border-b border-b-input px-0 py-1 text-sm",
            "focus-visible:border-b-ring outline-none transition-colors",
            "cursor-pointer"
          )}
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-32 shrink-0">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Brand
        </label>
        <select
          value={params.brand || ""}
          onChange={(e) => updateParam("brand", e.target.value)}
          className={cn(
            "h-10 w-full bg-transparent border-0 border-b border-b-input px-0 py-1 text-sm",
            "focus-visible:border-b-ring outline-none transition-colors",
            "cursor-pointer"
          )}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="w-32 shrink-0">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Sort By
        </label>
        <select
          value={`${params.sortBy || "createdAt"}:${params.sortOrder || "desc"}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(":")
            onParamsChange({ sortBy, sortOrder })
          }}
          className={cn(
            "h-10 w-full bg-transparent border-0 border-b border-b-input px-0 py-1 text-sm",
            "focus-visible:border-b-ring outline-none transition-colors",
            "cursor-pointer"
          )}
        >
          <option value="createdAt:desc">Newest</option>
          <option value="priceRatePerDay:asc">Price: Low to High</option>
          <option value="priceRatePerDay:desc">Price: High to Low</option>
          <option value="name:asc">Name: A to Z</option>
        </select>
      </div>

      <div className="w-20 shrink-0">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Min Price
        </label>
        <Input
          type="number"
          min={0}
          placeholder="$0"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>

      <div className="w-20 shrink-0">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Max Price
        </label>
        <Input
          type="number"
          min={0}
          placeholder="$999"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div className="w-32 shrink-0">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Avail. From
        </label>
        <Input
          type="date"
          min={today}
          value={params.availableFrom || ""}
          onChange={(e) => updateParam("availableFrom", e.target.value)}
        />
      </div>

      <div className="w-32 shrink-0">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Avail. To
        </label>
        <Input
          type="date"
          min={today}
          value={params.availableTo || ""}
          onChange={(e) => updateParam("availableTo", e.target.value)}
        />
      </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
