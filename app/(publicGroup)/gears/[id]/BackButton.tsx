"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="gap-1.5 text-muted-foreground hover:text-foreground"
    >
      &larr; Back
    </Button>
  )
}
