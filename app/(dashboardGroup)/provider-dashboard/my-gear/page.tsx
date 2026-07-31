import Link from "next/link"
import { Plus } from "@phosphor-icons/react/ssr"
import { InventoryTable } from "../../_components/provider/InventoryTable"
import { Button } from "@/components/ui/button"

const MyGearPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            My Gear
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your inventory
          </p>
        </div>
        <Button asChild>
          <Link href="/provider-dashboard/gear/new">
            <Plus />
            Add Gear
          </Link>
        </Button>
      </div>

      <InventoryTable />
    </div>
  )
}

export default MyGearPage
