import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CardField } from "@/components/shared/card-field"
import type { IGearItem } from "@/lib/types"

interface SpecificationsProps {
  gear: IGearItem
}

function formatRange(date: string): string {
  try {
    return format(new Date(date), "MMM d")
  } catch {
    return date
  }
}

export function Specifications({ gear }: SpecificationsProps) {
  const ranges = gear.unavailableRanges ?? []
  const visibleRanges = ranges.slice(0, 3)
  const hasMoreRanges = ranges.length > 3

  return (
    <section className="border-t border-border pt-8">
      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CardField label="Brand">{gear.brand || "—"}</CardField>
            <CardField label="Category">
              {gear.category?.name || "—"}
            </CardField>
            <CardField label="Price / Day">
              ${gear.priceRatePerDay.toLocaleString()}
            </CardField>
            <CardField label="Total Stock">{gear.quantity}</CardField>
            <CardField label="Available Now">
              {gear.availableQuantity}
            </CardField>
            <CardField label="Provider">
              {gear.provider?.name || "—"}
            </CardField>
            <CardField label="Availability" className="sm:col-span-2">
              {visibleRanges.length > 0 ? (
                <span className="space-y-1">
                  <span className="text-muted-foreground">Unavailable:</span>
                  <span className="block">
                    {visibleRanges
                      .map(
                        (range) =>
                          `${formatRange(range.startDate)} – ${formatRange(
                            range.endDate
                          )}`
                      )
                      .join(", ")}
                    {hasMoreRanges && ` +${ranges.length - 3} more`}
                  </span>
                </span>
              ) : (
                "Available for all selected dates"
              )}
            </CardField>
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}