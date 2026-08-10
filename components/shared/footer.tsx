import Link from "next/link"
import {
  Bicycle,
  EnvelopeSimple,
  Phone,
  FacebookLogo,
  InstagramLogo,
  XLogo,
} from "@phosphor-icons/react/ssr"

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Browse Gear", href: "/gears" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { label: "Become a Vendor", href: "/register?role=PROVIDER" },
      { label: "Sign In", href: "/login" },
    ],
  },
]

const socials = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookLogo },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramLogo },
  { label: "X", href: "https://x.com", icon: XLogo },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight text-primary"
            >
              <Bicycle />
              GearUp
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Rent premium cycling gear from local providers. Bikes, accessories,
              and equipment — all in one place.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-heading text-xs font-semibold tracking-widest uppercase text-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a
              href="mailto:support@gearup.com"
              className="inline-flex items-center gap-2 transition-colors hover:text-primary"
            >
              <EnvelopeSimple size={16} />
              support@gearup.com
            </a>
            <span className="inline-flex items-center gap-2">
              <Phone size={16} />
              +880 1926-312799
            </span>
          </div>
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-9 items-center justify-center text-muted-foreground ring-1 ring-foreground/10 transition-colors hover:text-primary hover:ring-primary/30"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {year} GearUp. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="transition-colors hover:text-primary"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-primary"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
