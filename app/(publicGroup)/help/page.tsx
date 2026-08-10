"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Minus } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GearSix, Lifebuoy, Student, ArrowRight } from "@phosphor-icons/react"
import { faqItems } from "@/components/sections/faq"

const helpTopics = [
  {
    icon: GearSix,
    title: "Renting & Booking",
    description:
      "Find the right gear, place a rental order, and manage your bookings from the customer dashboard.",
  },
  {
    icon: Student,
    title: "Listing Gear",
    description:
      "Providers can publish gear, set daily rates, and track incoming orders from the provider dashboard.",
  },
  {
    icon: Lifebuoy,
    title: "Account & Support",
    description:
      "Update your profile, change your password, or get in touch with our support team for help.",
  },
]

const gearGuides = [
  {
    title: "How to choose the right bike size",
    body: "Measure your inseam and compare it against the frame size chart for the bike type you want. Road, mountain, and hybrid bikes all fit differently — when in doubt, choose a frame one size smaller and adjust the seat before you ride.",
  },
  {
    title: "What to check when picking up gear",
    body: "Inspect brakes, tires, and gears before you leave. Confirm the rental period and quantity on your order, report any existing damage to the provider on the spot, and keep the gear exactly as you received it.",
  },
  {
    title: "Booking dates and availability",
    body: "Select a start and end date, and the panel will show live availability and total cost. Make sure your pickup and return dates match your plans — dates are fixed once the booking is confirmed.",
  },
  {
    title: "Caring for your rental",
    body: "Store the gear securely, avoid leaving it in the rain, and return it clean and undamaged. If something breaks, contact the provider right away instead of trying to fix it yourself.",
  },
]

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          Help Center
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Everything you need to get the most out of GearUp. Choose a topic
          below, or contact our support team for assistance.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {helpTopics.map((topic) => (
          <Card key={topic.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <topic.icon className="text-primary" />
                {topic.title}
              </CardTitle>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>

      <section className="mx-auto mt-20 max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-muted-foreground">
            Quick answers to the questions we hear most
          </p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {faqItems.map((faq, i) => {
            const open = openIndex === i
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-heading text-sm font-semibold tracking-wide">
                    {faq.question}
                  </span>
                  {open ? (
                    <Minus className="shrink-0 text-accent-solid" />
                  ) : (
                    <Plus className="shrink-0 text-accent-solid" />
                  )}
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Gear Guides
          </h2>
          <p className="mt-2 text-muted-foreground">
            How-to tips for a smooth rental experience
          </p>
        </div>
        <div className="grid gap-4">
          {gearGuides.map((guide) => (
            <div key={guide.title} className="rounded-md border border-border bg-card p-6">
              <h3 className="font-heading text-lg font-semibold tracking-wide">
                {guide.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {guide.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl rounded-md border border-border bg-muted/40 p-8 text-center">
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          Still need help?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">
          Our support team is happy to answer questions about bookings,
          payments, or your account.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Contact Support
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
