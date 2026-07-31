"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { cancelRental } from "@/lib/api/rentals"

export function useCancelRental() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cancelRental(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] })
      toast.success("Order cancelled")
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel order"
      )
    },
  })
}
