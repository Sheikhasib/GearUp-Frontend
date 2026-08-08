"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowClockwise, House } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface ErrorFallbackProps {
  error: Error & { digest?: string }
  unstable_retry: () => void
}

export function ErrorFallback({ error, unstable_retry }: ErrorFallbackProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="font-heading text-6xl font-bold text-muted-foreground/30">
        500
      </div>
      <h2 className="font-heading mt-4 text-2xl font-bold tracking-tight">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button type="button" onClick={unstable_retry}>
          <ArrowClockwise className="h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <House className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
