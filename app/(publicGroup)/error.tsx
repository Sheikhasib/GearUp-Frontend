"use client"

export default function PublicGroupError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="font-heading text-6xl font-bold text-muted-foreground/30">500</h1>
      <h2 className="font-heading text-2xl font-bold tracking-tight mt-4">Something went wrong</h2>
      <p className="text-muted-foreground mt-2 max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex h-11 items-center px-8 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:bg-primary/80 transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>
  )
}
