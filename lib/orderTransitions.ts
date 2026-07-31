import type { RentalStatus } from "@/lib/types"

export interface OrderTransition {
  next: RentalStatus
  label: string
}

// Provider-facing status transitions, mirroring the backend ALLOWED_TRANSITIONS.
export const ORDER_TRANSITIONS: Partial<Record<RentalStatus, OrderTransition>> = {
  PLACED: { next: "CONFIRMED", label: "Confirm" },
  PAID: { next: "PICKED_UP", label: "Mark Picked Up" },
  PICKED_UP: { next: "RETURNED", label: "Mark Returned" },
}

export const ACTIVE_RENTAL_STATUSES: RentalStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
]
