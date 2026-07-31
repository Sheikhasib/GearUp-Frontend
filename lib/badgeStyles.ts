export const STATUS_LABELS: Record<string, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  PICKED_UP: "Picked Up",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
}

export const STATUS_STYLES: Record<string, string> = {
  PLACED:
    "text-amber-600 bg-amber-50 ring-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:ring-amber-400/30",
  CONFIRMED:
    "text-blue-600 bg-blue-50 ring-blue-200 dark:text-blue-400 dark:bg-blue-400/10 dark:ring-blue-400/30",
  PAID: "text-purple-600 bg-purple-50 ring-purple-200 dark:text-purple-400 dark:bg-purple-400/10 dark:ring-purple-400/30",
  PICKED_UP:
    "text-green-600 bg-green-50 ring-green-200 dark:text-green-400 dark:bg-green-400/10 dark:ring-green-400/30",
  RETURNED:
    "text-gray-600 bg-gray-50 ring-gray-200 dark:text-gray-400 dark:bg-gray-400/10 dark:ring-gray-400/30",
  CANCELLED:
    "text-red-600 bg-red-50 ring-red-200 dark:text-red-400 dark:bg-red-400/10 dark:ring-red-400/30",
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PAID: "Paid",
  PENDING: "Pending",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
}

export const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PAID: "text-green-600 bg-green-50 ring-green-200 dark:text-green-400 dark:bg-green-400/10 dark:ring-green-400/30",
  PENDING:
    "text-amber-600 bg-amber-50 ring-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:ring-amber-400/30",
  FAILED:
    "text-red-600 bg-red-50 ring-red-200 dark:text-red-400 dark:bg-red-400/10 dark:ring-red-400/30",
  CANCELLED:
    "text-gray-600 bg-gray-50 ring-gray-200 dark:text-gray-400 dark:bg-gray-400/10 dark:ring-gray-400/30",
}

export const USER_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
}

export const USER_STATUS_STYLES: Record<string, string> = {
  ACTIVE: "text-green-600 bg-green-50 ring-green-200 dark:text-green-400 dark:bg-green-400/10 dark:ring-green-400/30",
  SUSPENDED:
    "text-red-600 bg-red-50 ring-red-200 dark:text-red-400 dark:bg-red-400/10 dark:ring-red-400/30",
}
