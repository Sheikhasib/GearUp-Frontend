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

// Provider-facing cancellations. The backend allows CANCELLED only from
// PLACED/CONFIRMED, so a provider can cancel when the gear is unavailable.
export const ORDER_CANCELLATIONS: Partial<Record<RentalStatus, OrderTransition>> = {
  PLACED: { next: "CANCELLED", label: "Cancel" },
  CONFIRMED: { next: "CANCELLED", label: "Cancel" },
}

export const ACTIVE_RENTAL_STATUSES: RentalStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PAID",
  "PICKED_UP",
]
