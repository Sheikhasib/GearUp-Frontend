export default function AdminMessagesLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-40 rounded bg-muted" />
        <div className="h-4 w-56 rounded bg-muted" />
      </div>

      <div className="h-10 w-full max-w-xs rounded bg-muted" />
      <div className="mt-4 h-64 rounded-md bg-muted" />
    </div>
  )
}
