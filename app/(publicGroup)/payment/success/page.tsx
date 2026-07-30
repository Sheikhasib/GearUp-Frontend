import Link from "next/link"
import { getPaymentStatus } from "../../_actions/payment/getPaymentStatus"
import { fetchRentalOrderServer } from "@/lib/api/rentals"

const PaymentSuccessPage = async ({
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

  if (!isPaid || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <span className="text-2xl">&#9888;</span>
          </div>
          <h1 className="font-heading text-2xl font-bold">Payment not confirmed</h1>
          <p className="text-muted-foreground text-sm">
            We could not confirm your payment. If you were charged, please contact support.
          </p>
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

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-3xl text-green-600">&#10003;</span>
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight">Payment Successful!</h1>
        <p className="text-muted-foreground text-sm">
          Your payment of <span className="font-semibold text-foreground">${order.totalPrice.toLocaleString()}</span>{" "}
          for <span className="font-semibold text-foreground">{order.gearItem?.name ?? "gear"}</span> has been processed.
        </p>

        <div className="bg-card p-4 ring-1 ring-foreground/5 text-left text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono text-xs">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Period</span>
            <span>
              {new Date(order.startDate).toLocaleDateString()} –{" "}
              {new Date(order.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction</span>
            <span className="font-mono text-xs">{paymentStatus.data?.tranId ?? "—"}</span>
          </div>
        </div>

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

export default PaymentSuccessPage
