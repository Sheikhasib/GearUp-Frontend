"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  fetchAdminUsers,
  updateUserStatus,
  fetchAdminGears,
  fetchAdminOrders,
} from "@/lib/api/admin"
import type { IUser, UserStatus } from "@/lib/types"

export function useAdminUsers(role?: string) {
  return useQuery({
    queryKey: ["admin-users", role ?? "all"],
    queryFn: () => fetchAdminUsers(role),
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      updateUserStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-users"] })
      const previousLists = queryClient.getQueriesData({ queryKey: ["admin-users"] })

      queryClient.setQueriesData(
        { queryKey: ["admin-users"] },
        (old?: IUser[]) => old?.map((user) => (user.id === id ? { ...user, status } : user))
      )

      return { previousLists }
    },
    onError: (error, _variables, context) => {
      context?.previousLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      toast.error(
        error instanceof Error ? error.message : "Failed to update user status"
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    },
  })
}

export function useAdminGears() {
  return useQuery({
    queryKey: ["admin-gears"],
    queryFn: fetchAdminGears,
  })
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchAdminOrders,
  })
}
