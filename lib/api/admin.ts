import { apiClient } from "./client"
import type { IUser, IGearItem, IRentalOrder, UserStatus } from "@/lib/types"

export async function fetchAdminUsers(role?: string): Promise<IUser[]> {
  const qs = role ? `?role=${role}` : ""
  return apiClient(`/admin/users${qs}`)
}

export async function updateUserStatus(
  id: string,
  status: UserStatus
): Promise<IUser> {
  return apiClient(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export async function fetchAdminGears(): Promise<IGearItem[]> {
  return apiClient("/admin/gear")
}

export async function fetchAdminOrders(): Promise<IRentalOrder[]> {
  return apiClient("/admin/rentalOrders")
}
