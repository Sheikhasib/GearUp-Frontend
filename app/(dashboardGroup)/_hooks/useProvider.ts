"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createGear, fetchMyGear, deleteGear, fetchIncomingOrders, updateOrderStatus } from "@/lib/api/provider"
import type { ICreateGearPayload } from "@/lib/types"

export function useMyGear() {
  return useQuery({
    queryKey: ["my-gear"],
    queryFn: fetchMyGear,
  })
}

export function useCreateGear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ICreateGearPayload) => createGear(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-gear"] })
    },
  })
}

export function useDeleteGear() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGear(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-gear"] })
    },
  })
}

export function useIncomingOrders() {
  return useQuery({
    queryKey: ["incoming-orders"],
    queryFn: fetchIncomingOrders,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incoming-orders"] })
    },
  })
}
