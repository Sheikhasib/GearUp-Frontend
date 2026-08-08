"use client"

import { useState } from "react"
import { Plus, Minus } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How do booking dates work?",
    answer:
      "Choose your gear, pick a start and end date, and the total price is calculated from the daily rate. Bookings are held for exactly the dates you select.",
  },
  {
    question: "How do I know a gear is available?",
    answer:
      "Each gear listing shows live availability. When you select dates, the panel checks overlapping bookings and daily quantity so you only confirm what's actually free.",
  },
  {
    question: "How do payments work via SSLCommerz?",
    answer:
      "Checkout is handled securely by SSLCommerz. You'll be redirected to a payment page, and your booking is confirmed once the payment is verified.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "You can cancel a booking from your dashboard before it is picked up. Depending on the status, cancellations may be refunded; contact support for specific cases.",
  },
  {
    question: "What happens after I return the gear?",
    answer:
      "Once you return the gear, the provider confirms the return, the order is marked returned, and you can leave a review for the gear.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-muted-foreground">
          Everything you need to know before you ride
        </p>
      </div>
      <div className="divide-y divide-border border-y border-border">
        {faqs.map((faq, i) => {
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
  )
}
