"use client"

import { useState, useEffect, useCallback } from "react"
import { useCategories } from "@/hooks/useCategories"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface GearFiltersProps {
  params: {
    search?: string
    categoryId?: string
    minPrice?: string
    maxPrice?: string
    availableFrom?: string
    availableTo?: string
  }
  onParamsChange: (params: Record<string, string>) => void
}

export function GearFilters({ params, onParamsChange }: GearFiltersProps) {
  const { data: categories } = useCategories()
  const [search, setSearch] = useState(params.search || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (params.search || "")) {
        onParamsChange({ search })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const updateParam = useCallback(
    (key: string, value: string) => {
      onParamsChange({ [key]: value })
    },
    [onParamsChange]
  )

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Search
        </label>
        <Input
          placeholder="Search gear..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-44">
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

      <div className="w-28">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Min Price
        </label>
        <Input
          type="number"
          min={0}
          placeholder="$0"
          value={params.minPrice || ""}
          onChange={(e) => updateParam("minPrice", e.target.value)}
        />
      </div>

      <div className="w-28">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Max Price
        </label>
        <Input
          type="number"
          min={0}
          placeholder="$999"
          value={params.maxPrice || ""}
          onChange={(e) => updateParam("maxPrice", e.target.value)}
        />
      </div>

      <div className="w-36">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Avail. From
        </label>
        <Input
          type="date"
          value={params.availableFrom || ""}
          onChange={(e) => updateParam("availableFrom", e.target.value)}
        />
      </div>

      <div className="w-36">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Avail. To
        </label>
        <Input
          type="date"
          value={params.availableTo || ""}
          onChange={(e) => updateParam("availableTo", e.target.value)}
        />
      </div>
    </div>
  )
}
