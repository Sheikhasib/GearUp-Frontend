import Link from "next/link"
import { EnvelopeSimple, Phone, Question } from "@phosphor-icons/react/dist/ssr"
import { ContactForm } from "@/components/sections/contact-form"

const contactDetails = [
  {
    icon: EnvelopeSimple,
    label: "Email us",
    value: "support@gearup.com",
    href: "mailto:support@gearup.com",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+880 1926-312799",
    href: "tel:+8801926312799",
  },
]

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          Contact Us
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Questions about a rental, your account, or becoming a provider? Send
          us a message and our support team will get back to you within one
          business day.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-md border border-border bg-card p-6">
            <ContactForm />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="rounded-md border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-semibold tracking-wide">
                Reach us directly
              </h2>
              <div className="mt-4 space-y-4">
                {contactDetails.map((detail) => (
                  <a
                    key={detail.label}
                    href={detail.href}
                    className="flex items-center gap-4 group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <detail.icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                        {detail.label}
                      </p>
                      <p className="text-sm font-medium group-hover:text-primary">
                        {detail.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-semibold tracking-wide">
                Looking for quick answers?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Our help center covers booking dates, payments, cancellations,
                and returns.
              </p>
              <Link
                href="/help"
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
              >
                <Question size={16} />
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
