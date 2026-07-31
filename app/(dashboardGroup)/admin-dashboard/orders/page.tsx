import { OrderModerationTable } from "../../_components/admin/OrderModerationTable"

const AdminOrdersPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Rental Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All rental orders across the platform
        </p>
      </div>

      <OrderModerationTable />
    </div>
  )
}

export default AdminOrdersPage
