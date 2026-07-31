"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createGear,
  fetchMyGear,
  updateGear,
  deleteGear,
  fetchIncomingOrders,
  updateOrderStatus,
} from "@/lib/api/provider"
import type {
  ICreateGearPayload,
  IUpdateGearPayload,
  IRentalOrder,
  RentalStatus,
} from "@/lib/types"

export function useMyGear() {
  return useQuery({
    queryKey: ["my-gear"],
    queryFn: fetchMyGear,
  })
}

export function useProviderGear(id: string) {
  const { data: gears, ...rest } = useMyGear()
  return {
    ...rest,
    data: gears?.find((gear) => gear.id === id),
  }
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

export function useUpdateGear(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IUpdateGearPayload) => updateGear(id, payload),
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
    mutationFn: ({ id, status }: { id: string; status: RentalStatus }) =>
      updateOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["incoming-orders"] })
      const previousOrders = queryClient.getQueryData<IRentalOrder[]>([
        "incoming-orders",
      ])

      queryClient.setQueryData<IRentalOrder[]>(["incoming-orders"], (old) =>
        old?.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      )

      return { previousOrders }
    },
    onError: (error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(
          ["incoming-orders"],
          context.previousOrders
        )
      }
      toast.error(
        error instanceof Error ? error.message : "Failed to update order status"
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["incoming-orders"] })
    },
  })
}
