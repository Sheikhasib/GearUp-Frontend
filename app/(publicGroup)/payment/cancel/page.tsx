import Link from "next/link"
import { getPaymentStatus } from "../../_actions/payment/getPaymentStatus"
import { fetchRentalOrderServer } from "@/service/fetchRentalOrderServer"

const PaymentCancelPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) => {
  const { orderId } = await searchParams

  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-heading text-2xl font-bold">Invalid request</h1>
          <p className="text-muted-foreground">No order ID provided.</p>
          <Link
            href="/customer-dashboard"
            className="inline-block text-sm font-semibold text-primary hover:underline"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const [paymentStatus, order] = await Promise.all([
    getPaymentStatus(orderId),
    fetchRentalOrderServer(orderId),
  ])

  const isPaid = Boolean(
    paymentStatus?.success && paymentStatus.data?.isPaid,
  ) || order?.status === "PAID"

  if (isPaid) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-3xl text-green-600">&#10003;</span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Payment Already Processed</h1>
          <p className="text-muted-foreground text-sm">
            This payment has already been completed successfully.
          </p>
          <Link
            href="/customer-dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-2xl text-red-600">&#10007;</span>
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight">Payment Cancelled</h1>
        <p className="text-muted-foreground text-sm">
          Your payment was cancelled. No charges have been made.
          {order?.status === "CONFIRMED" && (
            <> You can try again whenever you&apos;re ready.</>
          )}
        </p>

        {order && (
          <div className="bg-card p-4 ring-1 ring-foreground/5 text-left text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-xs">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="font-semibold">${order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          {order?.status === "CONFIRMED" && (
            <Link
              href={`/customer-dashboard/orders/${orderId}/pay`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Retry Payment
            </Link>
          )}
          <Link
            href="/customer-dashboard"
            className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-muted-foreground ring-1 ring-border hover:bg-muted transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancelPage
