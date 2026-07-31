import { Bicycle } from "@phosphor-icons/react/ssr"

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary animate-pulse">
          <Bicycle size={28} />
        </div>
        <div className="h-4 w-40 bg-muted rounded animate-pulse" />
      </div>
    </div>
  )
}
