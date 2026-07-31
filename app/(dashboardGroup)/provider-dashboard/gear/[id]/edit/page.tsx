"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react"
import { useProviderGear } from "../../../../_hooks/useProvider"
import { GearForm } from "../../../../_components/provider/GearForm"

const EditGearPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)
  const { data: gear, isLoading } = useProviderGear(id)

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-muted" />
  }

  if (!gear) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-md border border-border py-20 text-center">
          <p className="text-lg text-foreground">Gear not found</p>
          <Link
            href="/provider-dashboard/my-gear"
            className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Back to My Gear
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/provider-dashboard/my-gear"
        className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to My Gear
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Edit Gear
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{gear.name}</p>
      </div>

      <GearForm
        mode="edit"
        gearId={gear.id}
        defaultValues={{
          name: gear.name,
          description: gear.description,
          brand: gear.brand,
          categoryId: gear.categoryId,
          priceRatePerDay: Number(gear.priceRatePerDay),
          quantity: gear.quantity,
          images: gear.images,
          isAvailable: gear.isAvailable,
        }}
      />
    </div>
  )
}

export default EditGearPage
