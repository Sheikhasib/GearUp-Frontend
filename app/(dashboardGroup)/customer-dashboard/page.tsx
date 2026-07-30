import { cookies } from "next/headers"
import Link from "next/link"
import { CustomerDashboardClient } from "../_components/CustomerDashboardClient"
import type { IRentalOrder } from "@/lib/types"

const API_BASE = process.env.BACKEND_API_URL || "http://localhost:4000"

async function fetchMyOrders(): Promise<IRentalOrder[]> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  if (!accessToken) return []

  try {
    const res = await fetch(`${API_BASE}/api/rentals`, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": `accessToken=${accessToken}`,
      },
      cache: "no-cache",
    })
    const json = await res.json()
    if (!json.success) return []
    return json.data ?? []
  } catch {
    return []
  }
}

const statusLabel: Record<string, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  PICKED_UP: "Picked Up",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
}

const statusColor: Record<string, string> = {
  PLACED: "text-yellow-600 bg-yellow-50 ring-yellow-200",
  CONFIRMED: "text-blue-600 bg-blue-50 ring-blue-200",
  PAID: "text-green-600 bg-green-50 ring-green-200",
  PICKED_UP: "text-purple-600 bg-purple-50 ring-purple-200",
  RETURNED: "text-gray-600 bg-gray-50 ring-gray-200",
  CANCELLED: "text-red-600 bg-red-50 ring-red-200",
}

const CustomerDashboardPage = async () => {
  const orders = await fetchMyOrders()

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CustomerDashboardClient />

      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          My Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-lg">No orders yet</p>
          <Link
            href="/gears"
            className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Browse gear to rent
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col justify-between gap-4 bg-card p-5 ring-1 ring-foreground/5 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate font-heading font-semibold">
                  {order.gearItem?.name ?? "Gear"}
                </p>
                <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                  <span>
                    {new Date(order.startDate).toLocaleDateString()} –{" "}
                    {new Date(order.endDate).toLocaleDateString()}
                  </span>
                  <span>x{order.quantity}</span>
                  <span>${order.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${statusColor[order.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
                >
                  {statusLabel[order.status] || order.status}
                </span>

                {order.status === "CONFIRMED" && (
                  <Link
                    href={`/customer-dashboard/orders/${order.id}/pay`}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Pay Now
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerDashboardPage
