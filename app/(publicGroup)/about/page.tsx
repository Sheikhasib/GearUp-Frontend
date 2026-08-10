import Link from "next/link"
import {
  MapPin,
  CalendarCheck,
  ShieldCheck,
  Storefront,
  HandHeart,
  Recycle,
} from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"

const values = [
  {
    icon: Recycle,
    title: "Rent, don't buy",
    description:
      "Gear sits idle most of the time. Renting makes high-quality equipment affordable while reducing waste.",
  },
  {
    icon: HandHeart,
    title: "Local first",
    description:
      "We connect you with providers in your own community, keeping rentals convenient and supporting local businesses.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & safety",
    description:
      "Verified providers, secure SSLCommerz payments, and clear return policies on every rental.",
  },
]

const roles = [
  {
    icon: Storefront,
    title: "Customers",
    description:
      "Browse gear by category, book exact dates, pay securely, and review your rental after returning it.",
  },
  {
    icon: MapPin,
    title: "Providers",
    description:
      "List your gear with daily rates, manage availability, and track incoming orders from one dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    description:
      "Keep the marketplace healthy by moderating gear, orders, categories, and user accounts.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-14 max-w-3xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          About GearUp
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          GearUp is a rental marketplace built around a simple idea: why buy
          what you only use for a day? From bikes to camping gear, rent
          top-quality equipment from trusted local providers whenever you need
          it.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <div
            key={value.title}
            className="rounded-md border border-border bg-card p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent-solid/10 text-accent-solid">
              <value.icon size={26} />
            </div>
            <h2 className="mt-5 font-heading text-lg font-semibold tracking-wide">
              {value.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {value.description}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            How the marketplace works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Three roles, one shared goal — great gear for everyone
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <div
              key={role.title}
              className="rounded-md border border-border bg-muted/40 p-8 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                <role.icon size={26} />
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold tracking-wide">
                {role.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-md bg-accent-solid px-8 py-14 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-accent-solid-foreground">
          Ready to get moving?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-accent-solid-foreground/80 leading-relaxed">
          Browse available gear today or sign up as a provider and start earning
          from gear you already own.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="cursor-pointer">
            <Link href="/gears">
              <CalendarCheck size={18} />
              Browse Gear
            </Link>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="cursor-pointer"
          >
            <Link href="/register?role=PROVIDER">Become a Provider</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
