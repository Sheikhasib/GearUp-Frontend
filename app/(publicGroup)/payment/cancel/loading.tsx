export default function PaymentCancelLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center animate-pulse">
      <div className="w-full max-w-md space-y-6 px-4 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-muted" />
        <div className="mx-auto h-8 w-56 bg-muted rounded" />
        <div className="mx-auto h-4 w-80 bg-muted rounded" />
        <div className="mx-auto space-y-1 bg-card p-4 ring-1 ring-foreground/5">
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
          </div>
        </div>
        <div className="mx-auto flex items-center justify-center gap-4">
          <div className="h-11 w-36 bg-muted rounded" />
          <div className="h-11 w-36 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}
