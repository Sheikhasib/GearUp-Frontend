import { PaymentHistoryTable } from "../../_components/payment/PaymentHistoryTable"

const CustomerPaymentsPage = async () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Payments
        </h1>
      </div>

      <PaymentHistoryTable />
    </div>
  )
}

export default CustomerPaymentsPage
