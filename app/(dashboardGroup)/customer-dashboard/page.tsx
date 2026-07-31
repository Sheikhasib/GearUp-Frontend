import Link from "next/link"
import { CustomerDashboardClient } from "../_components/CustomerDashboardClient"
import { ArrowRight, Receipt, CreditCard } from "@phosphor-icons/react/ssr"

const QUICK_LINKS = [
  {
    label: "My Orders",
    href: "/customer-dashboard/orders",
    description: "View and track your rental orders",
    icon: Receipt,
  },
  {
    label: "Payments",
    href: "/customer-dashboard/payments",
    description: "Review your payment history",
    icon: CreditCard,
  },
]

const CustomerDashboardPage = async () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CustomerDashboardClient />

      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-4 rounded-md border border-border bg-card p-6 transition-colors hover:bg-muted/50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <link.icon size={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold tracking-wide uppercase">
                {link.label}
              </p>
              <p className="text-sm text-muted-foreground">
                {link.description}
              </p>
            </div>
            <ArrowRight className="text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CustomerDashboardPage
