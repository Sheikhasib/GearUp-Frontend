import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaBand() {
  return (
    <section className="bg-primary py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-primary-foreground">
          Rent your gear today
        </h2>
        <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
          Join local riders and providers on GearUp. Pick your gear, book your
          dates, and get riding.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/gears">Browse Gear</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register?role=PROVIDER">Become a Vendor</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
