"use client"

import Link from "next/link"
import { useAdminGears } from "../../_hooks/useAdmin"
import { CardField } from "@/components/shared/card-field"

export function GearModerationTable() {
  const { data: gears, isLoading } = useAdminGears()

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-muted" />
  }

  if (!gears || gears.length === 0) {
    return (
      <div className="rounded-md border border-border py-20 text-center">
        <p className="text-lg text-foreground">No gear listings</p>
      </div>
    )
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-md border border-border bg-card sm:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Gear
              </th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Provider
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
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {gears.map((gear) => (
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
                      <Link
                        href={`/gears/${gear.id}`}
                        className="font-medium hover:underline"
                      >
                        {gear.name}
                      </Link>
                      {gear.brand && (
                        <p className="text-xs text-muted-foreground">{gear.brand}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p>{gear.provider?.name ?? "—"}</p>
                  {gear.provider?.email && (
                    <p className="text-xs text-muted-foreground">
                      {gear.provider.email}
                    </p>
                  )}
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
                      ? "text-green-600 bg-green-50 ring-green-200 dark:text-green-400 dark:bg-green-400/10 dark:ring-green-400/30"
                      : "text-red-600 bg-red-50 ring-red-200 dark:text-red-400 dark:bg-red-400/10 dark:ring-red-400/30"
                    }`}
                  >
                    {gear.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {gears.map((gear) => (
          <div key={gear.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              {gear.images?.[0] && (
                <img
                  src={gear.images[0]}
                  alt={gear.name}
                  className="h-14 w-14 shrink-0 rounded-md border border-border object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/gears/${gear.id}`}
                  className="font-medium hover:underline"
                >
                  {gear.name}
                </Link>
                {gear.brand && (
                  <p className="text-xs text-muted-foreground">{gear.brand}</p>
                )}
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${
                      gear.isAvailable
                      ? "text-green-600 bg-green-50 ring-green-200 dark:text-green-400 dark:bg-green-400/10 dark:ring-green-400/30"
                      : "text-red-600 bg-red-50 ring-red-200 dark:text-red-400 dark:bg-red-400/10 dark:ring-red-400/30"
                    }`}
                  >
                    {gear.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-3">
              <CardField label="Provider">{gear.provider?.name ?? "—"}</CardField>
              <CardField label="Category">
                {gear.category?.name ?? "—"}
              </CardField>
              <CardField label="Price / Day">
                ${Number(gear.priceRatePerDay).toFixed(2)}
              </CardField>
              <CardField label="Stock">
                {gear.availableQuantity}/{gear.quantity}
              </CardField>
            </dl>
          </div>
        ))}
      </div>
    </>
  )
}
