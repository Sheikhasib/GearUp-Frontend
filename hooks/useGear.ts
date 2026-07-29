"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchGear, fetchGearById } from "@/lib/api/gear"
import type { IGearQuery } from "@/lib/types"

export function useGear(query?: IGearQuery) {
  return useQuery({
    queryKey: ["gear", query],
    queryFn: () => fetchGear(query),
  })
}

export function useGearById(id: string) {
  return useQuery({
    queryKey: ["gear", id],
    queryFn: () => fetchGearById(id),
    enabled: !!id,
  })
}
