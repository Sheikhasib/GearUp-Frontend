export default function GearDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <div className="aspect-square bg-muted" />
          <div className="space-y-3">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-10 w-3/4 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-20 w-full bg-muted rounded" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-card ring-1 ring-foreground/5 p-6 space-y-4">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-12 w-full bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
