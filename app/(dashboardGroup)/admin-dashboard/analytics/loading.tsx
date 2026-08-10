export default function AdminAnalyticsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-40 rounded bg-muted" />
        <div className="h-4 w-56 rounded bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card p-6 ring-1 ring-foreground/5">
            <div className="h-12 w-12 rounded-md bg-muted" />
            <div className="mt-4 h-8 w-1/2 rounded bg-muted" />
            <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card p-6 ring-1 ring-foreground/5">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="mt-4 h-64 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
