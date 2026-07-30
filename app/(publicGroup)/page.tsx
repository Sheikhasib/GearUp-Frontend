import Link from "next/link"
import { GearCard } from "./_components/gear/GearCard"
import type { IGearItem } from "@/lib/types"

const API_URL = process.env.BACKEND_API_URL || "http://localhost:4000"

async function getFeaturedGear(): Promise<IGearItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/gear?limit=6`, { cache: "no-cache" })
    const json = await res.json()
    return json.data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const gears = await getFeaturedGear()

  return (
    <>
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
              Gear Up for
              <span className="text-primary block mt-2">Your Next Ride</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
              Rent premium cycling gear from local providers. Bikes, accessories, and equipment — all in one place.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/gears"
                className="inline-flex h-11 items-center px-8 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:bg-primary/80 transition-colors"
              >
                Browse Gear
              </Link>
              <Link
                href="/gears"
                className="inline-flex h-11 items-center px-8 border border-border text-xs font-semibold tracking-widest uppercase hover:bg-muted transition-colors"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section>

      {gears.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight">
                Featured Gear
              </h2>
              <p className="mt-2 text-muted-foreground">
                Top picks from our providers
              </p>
            </div>
            <Link
              href="/gears"
              className="text-xs font-semibold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gears.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
