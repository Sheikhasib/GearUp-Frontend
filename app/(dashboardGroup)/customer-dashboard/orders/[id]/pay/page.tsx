import { redirect } from "next/navigation"
import Link from "next/link"
import { createPaymentAction } from "../../../../_actions/payment/createPaymentAction"
import { GoBackButton } from "@/components/shared/go-back-button"
import { fetchRentalOrderServer } from "@/service/fetchRentalOrderServer"
import { formatRentalDay, formatRentalEndDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const PayPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) => {
  const { id } = await params
  const { error } = await searchParams
  const order = await fetchRentalOrderServer(id)

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold">Order not found</h1>
        <Link
          href="/customer-dashboard"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (
    order.status === "PAID" ||
    order.status === "PICKED_UP" ||
    order.status === "RETURNED" ||
    order.status === "CANCELLED"
  ) {
    redirect("/customer-dashboard")
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <GoBackButton label="Back to Dashboard" />
      <div className="mb-8" />

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30">
          {error}
        </div>
      )}

      <h1 className="font-heading text-3xl font-bold tracking-tight mb-8">Payment</h1>

      <div className="bg-card p-6 ring-1 ring-foreground/5 space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
            Gear
          </p>
          <p className="font-heading font-semibold text-lg">
            {order.gearItem?.name ?? "Gear"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              Start Date
            </p>
            <p>{formatRentalDay(order.startDate)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              End Date
            </p>
            <p>{formatRentalEndDate(order.endDate)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              Quantity
            </p>
            <p>x{order.quantity}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              Total
            </p>
            <p className="font-heading font-bold text-lg text-primary">
              ${order.totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          {order.status === "CONFIRMED" ? (
            <form
              action={createPaymentAction.bind(null, order.id)}
            >
              <Button type="submit" className="w-full">
                Pay with SSLCommerz
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                {order.status === "PLACED"
                  ? "Waiting for provider confirmation. You'll be able to pay once the provider confirms your order."
                  : `Order status: ${order.status}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PayPage
