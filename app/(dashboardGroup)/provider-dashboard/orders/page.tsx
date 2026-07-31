import { OrderTable } from "../../_components/provider/OrderTable"

const ProviderOrdersPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and update rental orders
        </p>
      </div>

      <OrderTable />
    </div>
  )
}

export default ProviderOrdersPage
