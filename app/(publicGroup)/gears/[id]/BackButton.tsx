"use client"

import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      &larr; Back
    </button>
  )
}
