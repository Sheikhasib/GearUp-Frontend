import Link from "next/link"
import {
  Bicycle,
  Tent,
  Lifebuoy,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Package,
  CalendarCheck,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr"
import { fetchCategories } from "@/lib/api/categories"
import { Button } from "@/components/ui/button"

const categoryTiles = [
  { icon: Bicycle, name: "Cycling", keyword: "cycling" },
  { icon: Tent, name: "Camping & Hiking", keyword: "hiking" },
  { icon: Lifebuoy, name: "Water Sports", keyword: "water" },
]

const steps = [
  {
    icon: MagnifyingGlass,
    title: "Find your gear",
    body: "Browse listings by category and filter by dates, price, and availability to find exactly what you need.",
  },
  {
    icon: CalendarCheck,
    title: "Book & pay securely",
    body: "Pick your rental window, review the total, and check out securely through SSLCommerz.",
  },
  {
    icon: Package,
    title: "Pick up & return",
    body: "Collect your gear at the start date and return it in the same condition when your rental ends.",
  },
]

export default async function ServicesPage() {
  const categories = await fetchCategories().catch(() => [])

  const featuredCategories = categoryTiles
    .map((tile) => {
      const match = categories.find((cat) =>
        cat.name.toLowerCase().includes(tile.keyword)
      )
      return match ? { ...tile, href: `/gears?categoryId=${match.id}` } : null
    })
    .filter((cat): cat is NonNullable<typeof cat> => cat !== null)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-14 max-w-3xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          Our Services
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          From mountain bikes to camping gear, GearUp connects you with
          reliable, well-maintained equipment — booked online and paid securely
          in minutes.
        </p>
      </div>

      <section>
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            What you can rent
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explore our most popular gear categories
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex flex-col items-center gap-4 rounded-md border border-border bg-card p-8 text-center transition-colors hover:bg-muted/50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary">
                <category.icon size={28} />
              </div>
              <h3 className="font-heading text-lg font-semibold tracking-wide">
                {category.name}
              </h3>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary transition-transform group-hover:translate-x-1">
                Browse gear <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" asChild className="cursor-pointer">
            <Link href="/gears">View all gear</Link>
          </Button>
        </div>
      </section>

      <section className="mt-20 bg-muted/40 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              How renting works
            </h2>
            <p className="mt-2 text-muted-foreground">
              Renting is as easy as 1-2-3
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="flex flex-col items-center gap-3 rounded-md bg-card p-8 text-center ring-1 ring-foreground/5"
              >
                <div className="flex h-14 w-14 items-center justify-center bg-accent-solid/10 text-accent-solid">
                  <step.icon size={28} />
                </div>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                  Step {i + 1}
                </span>
                <h3 className="font-heading text-lg font-semibold tracking-wide">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-2">
        <div className="rounded-md border border-border bg-card p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
            <CreditCard size={26} />
          </div>
          <h2 className="mt-5 font-heading text-lg font-semibold tracking-wide">
            Secure payments
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            All rentals are paid through SSLCommerz, Bangladesh&apos;s leading
            payment gateway. Your payment details are never stored by us, and
            your booking is only confirmed once payment is verified.
          </p>
        </div>
        <div className="rounded-md border border-border bg-card p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
            <ShieldCheck size={26} />
          </div>
          <h2 className="mt-5 font-heading text-lg font-semibold tracking-wide">
            Safety & returns
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Inspect your gear at pickup and report any issues to the provider
            on the spot. Return gear clean and in the same condition to avoid
            damage charges. See the full policy on our Terms page.
          </p>
        </div>
      </section>
    </div>
  )
}
