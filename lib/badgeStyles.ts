export const STATUS_LABELS: Record<string, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  PICKED_UP: "Picked Up",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
}

export const STATUS_STYLES: Record<string, string> = {
  PLACED: "text-amber-600 bg-amber-50 ring-amber-200",
  CONFIRMED: "text-blue-600 bg-blue-50 ring-blue-200",
  PAID: "text-purple-600 bg-purple-50 ring-purple-200",
  PICKED_UP: "text-green-600 bg-green-50 ring-green-200",
  RETURNED: "text-gray-600 bg-gray-50 ring-gray-200",
  CANCELLED: "text-red-600 bg-red-50 ring-red-200",
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
}

export const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PAID: "text-green-600 bg-green-50 ring-green-200",
  PENDING: "text-amber-600 bg-amber-50 ring-amber-200",
  FAILED: "text-red-600 bg-red-50 ring-red-200",
  CANCELLED: "text-gray-600 bg-gray-50 ring-gray-200",
}
