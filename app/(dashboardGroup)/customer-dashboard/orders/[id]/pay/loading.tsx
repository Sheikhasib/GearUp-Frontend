export default function PayPageLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-4 w-36 bg-muted rounded mb-8" />

      <div className="h-9 w-40 bg-muted rounded mb-8" />

      <div className="bg-card p-6 ring-1 ring-foreground/5 space-y-4">
        <div className="space-y-1">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-5 w-48 bg-muted rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((cell) => (
            <div key={cell} className="space-y-1">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <div className="h-11 w-full bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}
