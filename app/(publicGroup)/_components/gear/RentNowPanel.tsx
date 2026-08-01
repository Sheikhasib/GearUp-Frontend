"use client"

import { useState, useEffect } from "react"
import { DayPicker } from "react-day-picker"
import type { DateRange } from "react-day-picker"
import "react-day-picker/style.css"
import { Button } from "@/components/ui/button"
import { useRentSelectionStore } from "../../_store/rentSelectionStore"
import { useAuthStore } from "@/store/authStore"
import type { IGearItem } from "@/lib/types"
import { addDays, format } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createRentalOrderAction } from "../../_actions/gear/rentalActions"
import { isDateInUnavailableRange, toUTCMidnightISO, getMinAvailableQuantity } from "@/lib/validations/rental"

interface RentNowPanelProps {
  gear: IGearItem
}

export function RentNowPanel({ gear }: RentNowPanelProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [quantity, setQuantity] = useState(1)

  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const { setGear, setRentalDetails } = useRentSelectionStore()

  useEffect(() => {
    setGear({
      id: gear.id,
      name: gear.name,
      priceRatePerDay: gear.priceRatePerDay,
      availableQuantity: gear.availableQuantity,
    })
  }, [gear])

  const minAvailable =
    dateRange?.from && dateRange?.to
      ? getMinAvailableQuantity(
          dateRange.from,
          dateRange.to,
          gear.availableQuantity,
          gear.dailyAvailability
        )
      : gear.availableQuantity

  const maxQuantity = Math.min(gear.availableQuantity, minAvailable)

  const effectiveQuantity = maxQuantity > 0 ? Math.min(quantity, maxQuantity) : 0

  const days =
    dateRange?.from && dateRange?.to
      ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0

  const total = days * gear.priceRatePerDay * effectiveQuantity

  const handleRent = async () => {
    if (!dateRange?.from || !dateRange?.to || effectiveQuantity < 1) return

    if (!user) {
      router.push(`/login?redirectTo=/gears/${gear.id}`)
      return
    }

    setRentalDetails({
      startDate: dateRange.from,
      endDate: dateRange.to,
      days,
      totalPrice: total,
      quantity: effectiveQuantity,
    })

    const result = await createRentalOrderAction({
      gearItemId: gear.id,
      startDate: toUTCMidnightISO(dateRange.from),
      endDate: toUTCMidnightISO(addDays(dateRange.to, 1)),
      quantity: effectiveQuantity,
    })

    if (!result.success) {
      toast.error(result.message)
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isDateUnavailable = (date: Date) =>
    isDateInUnavailableRange(date, gear.unavailableRanges ?? [])

  const disabledMatchers = [{ before: today }, isDateUnavailable]

  return (
    <div className="sticky top-24 space-y-6 bg-card p-6 ring-1 ring-foreground/5">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          ${gear.priceRatePerDay}
          <span className="text-sm font-normal text-muted-foreground"> /day</span>
        </h2>
        {gear.brand && (
          <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">
            {gear.brand}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
          Select rental period
        </p>

        <div className="flex gap-3 text-sm">
          <div className="flex-1 space-y-1">
            <span className="text-[10px] tracking-wider uppercase text-muted-foreground">From</span>
            <p className="font-heading font-semibold">
              {dateRange?.from ? format(dateRange.from, "MMM d, yyyy") : "—"}
            </p>
          </div>
          <div className="flex-1 space-y-1">
            <span className="text-[10px] tracking-wider uppercase text-muted-foreground">To</span>
            <p className="font-heading font-semibold">
              {dateRange?.to ? format(dateRange.to, "MMM d, yyyy") : "—"}
            </p>
          </div>
        </div>

        <div className="hidden sm:block">
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            disabled={disabledMatchers}
            excludeDisabled
            numberOfMonths={2}
            className="!m-0"
          />
        </div>
        <div className="sm:hidden">
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            disabled={disabledMatchers}
            excludeDisabled
            numberOfMonths={1}
            className="!m-0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
          Quantity
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, effectiveQuantity - 1))}
            className="h-8 w-8 border border-border flex items-center justify-center text-sm hover:bg-muted transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center font-heading text-lg tabular-nums">{effectiveQuantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(maxQuantity, effectiveQuantity + 1))}
            disabled={effectiveQuantity >= maxQuantity || maxQuantity <= 0}
            className="h-8 w-8 border border-border flex items-center justify-center text-sm hover:bg-muted transition-colors disabled:opacity-30"
          >
            +
          </button>
          <span
            className={`text-[10px] ml-2 ${
              dateRange?.from && dateRange?.to && minAvailable === 0
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {dateRange?.from && dateRange?.to
              ? `${minAvailable} available for these dates`
              : `${gear.availableQuantity} available`}
          </span>
        </div>
      </div>

      {days > 0 && (
        <div className="space-y-1 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              ${gear.priceRatePerDay} x {days} days
            </span>
            <span>${gear.priceRatePerDay * days}</span>
          </div>
          {effectiveQuantity > 1 && (
            <div className="flex justify-between text-muted-foreground">
              <span>x {effectiveQuantity} units</span>
              <span>${gear.priceRatePerDay * days * effectiveQuantity}</span>
            </div>
          )}
          <div className="flex justify-between font-heading text-lg font-bold pt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">${total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <Button
        className="w-full cursor-pointer"
        size="lg"
        disabled={!dateRange?.from || !dateRange?.to || effectiveQuantity < 1}
        onClick={handleRent}
      >
        Rent Now
      </Button>
    </div>
  )
}
