import Link from "next/link"

export default function GearNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="font-heading text-6xl font-bold text-muted-foreground/30">404</h1>
      <h2 className="font-heading text-2xl font-bold tracking-tight mt-4">Gear not found</h2>
      <p className="text-muted-foreground mt-2 max-w-sm">
        The gear you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/gears"
        className="mt-8 inline-flex h-11 items-center px-8 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:bg-primary/80 transition-colors"
      >
        Browse Gear
      </Link>
    </div>
  )
}
