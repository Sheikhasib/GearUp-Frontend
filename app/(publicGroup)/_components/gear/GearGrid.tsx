"use client"

import { GearCard } from "./GearCard"
import type { IGearItem } from "@/lib/types"

function GearCardSkeleton() {
  return (
    <div className="flex flex-col bg-card ring-1 ring-foreground/5 animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-2/3 bg-muted rounded" />
      </div>
    </div>
  )
}

export function GearGrid({
  gears,
  isLoading,
}: {
  gears?: IGearItem[]
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <GearCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!gears?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-heading text-lg text-muted-foreground">No gear found</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {gears.map((gear) => (
        <GearCard key={gear.id} gear={gear} />
      ))}
    </div>
  )
}
