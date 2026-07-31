export default function GearReviewsLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-4 w-32 bg-muted rounded mb-8" />

      <div className="mb-8 space-y-3">
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="h-4 w-56 bg-muted rounded" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 ring-1 ring-foreground/5 bg-muted/30">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="h-3.5 w-3.5 bg-muted rounded-full" />
                ))}
              </div>
            </div>
            <div className="h-3 w-3/4 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
