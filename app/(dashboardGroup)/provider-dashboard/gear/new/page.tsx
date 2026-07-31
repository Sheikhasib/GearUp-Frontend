import { GearForm } from "../../../_components/provider/GearForm"

const AddGearPage = () => {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Add New Gear
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          List a new item for rent
        </p>
      </div>

      <GearForm mode="create" />
    </div>
  )
}

export default AddGearPage
