import { OrderHistoryTable } from "../../_components/customer/OrderHistoryTable"

const CustomerOrdersPage = async () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          My Orders
        </h1>
      </div>

      <OrderHistoryTable />
    </div>
  )
}

export default CustomerOrdersPage
