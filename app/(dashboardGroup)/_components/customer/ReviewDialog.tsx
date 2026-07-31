"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ReviewForm } from "./ReviewForm"

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rentalOrderId: string
  gearItemName: string
  onSuccess: () => void
}

export function ReviewDialog({ open, onOpenChange, rentalOrderId, gearItemName, onSuccess }: ReviewDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Leave a Review</SheetTitle>
          <SheetDescription>
            Share your experience to help others make better decisions.
          </SheetDescription>
        </SheetHeader>
        <div className="px-8 pb-8">
          <ReviewForm
            rentalOrderId={rentalOrderId}
            gearItemName={gearItemName}
            onSuccess={() => {
              onSuccess()
              onOpenChange(false)
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
