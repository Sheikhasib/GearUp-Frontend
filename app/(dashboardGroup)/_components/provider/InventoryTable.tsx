"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { PencilLine, Trash } from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { useMyGear, useIncomingOrders, useDeleteGear } from "../../_hooks/useProvider"
import { ACTIVE_RENTAL_STATUSES } from "@/lib/orderTransitions"

export function InventoryTable() {
  const { data: gears, isLoading } = useMyGear()
  const { data: orders } = useIncomingOrders()
  const { mutate: deleteGear, isPending: isDeleting } = useDeleteGear()
  const [gearToDelete, setGearToDelete] = useState<{
    id: string
    name: string
  } | null>(null)

  const activeOrderGearIds = new Set(
    (orders ?? [])
      .filter((order) => ACTIVE_RENTAL_STATUSES.includes(order.status))
      .map((order) => order.gearItem?.id)
      .filter((id): id is string => Boolean(id))
  )

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-muted" />
  }

  if (!gears || gears.length === 0) {
    return (
      <div className="rounded-md border border-border py-20 text-center">
        <p className="text-lg text-foreground">No gear listed yet</p>
        <Link
          href="/provider-dashboard/gear/new"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Add your first gear
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    if (!gearToDelete) return
    deleteGear(gearToDelete.id, {
      onSuccess: () => {
        toast.success("Gear deleted successfully")
        setGearToDelete(null)
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete gear"
        )
      },
    })
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Gear
              </th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Category
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Price / Day
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Stock
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Status
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {gears.map((gear) => {
              const hasActiveOrders = activeOrderGearIds.has(gear.id)
              return (
                <tr key={gear.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {gear.images?.[0] && (
                        <img
                          src={gear.images[0]}
                          alt={gear.name}
                          className="h-12 w-12 shrink-0 rounded-md border border-border object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{gear.name}</p>
                        {gear.brand && (
                          <p className="text-xs text-muted-foreground">{gear.brand}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {gear.category?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-right font-heading font-bold">
                    ${Number(gear.priceRatePerDay).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {gear.availableQuantity}/{gear.quantity}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${
                        gear.isAvailable
                          ? "text-green-600 bg-green-50 ring-green-200"
                          : "text-red-600 bg-red-50 ring-red-200"
                      }`}
                    >
                      {gear.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/provider-dashboard/gear/${gear.id}/edit`}>
                          <PencilLine />
                          Edit
                        </Link>
                      </Button>

                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {hasActiveOrders ? (
                              <span className="inline-flex">
                                <Button variant="destructive" size="sm" disabled>
                                  <Trash />
                                  Delete
                                </Button>
                              </span>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  setGearToDelete({ id: gear.id, name: gear.name })
                                }
                              >
                                <Trash />
                                Delete
                              </Button>
                            )}
                          </TooltipTrigger>
                          {hasActiveOrders && (
                            <TooltipContent>
                              Cannot delete — has active rentals
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Sheet
        open={!!gearToDelete}
        onOpenChange={(open) => {
          if (!open) setGearToDelete(null)
        }}
      >
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Delete gear?</SheetTitle>
            <SheetDescription>
              This will permanently remove &quot;{gearToDelete?.name}&quot;.
              This action cannot be undone.
            </SheetDescription>
          </SheetHeader>
          <div className="flex gap-3 px-8 pb-8">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setGearToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 cursor-pointer"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
