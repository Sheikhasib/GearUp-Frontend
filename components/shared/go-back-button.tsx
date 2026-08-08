"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface GoBackButtonProps {
  label?: string
}

export function GoBackButton({ label = "Back" }: GoBackButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="gap-1.5 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft />
      {label}
    </Button>
  )
}