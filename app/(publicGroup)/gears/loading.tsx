export default function GearsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded" />
        <div className="h-4 w-72 bg-muted rounded mt-3" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col bg-card ring-1 ring-foreground/5 animate-pulse">
            <div className="aspect-[4/3] bg-muted" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-2/3 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
