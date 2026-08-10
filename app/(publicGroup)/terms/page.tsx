import Link from "next/link"

const sections = [
  {
    title: "Bookings & dates",
    body: "A booking is held for exactly the start and end dates you select. Confirmed dates are fixed; extending a rental requires arranging it with the provider before the original end date.",
  },
  {
    title: "Availability",
    body: "Live availability is shown on each listing based on overlapping bookings and daily quantity. Your booking is only confirmed when the requested dates and quantity are available and payment is verified.",
  },
  {
    title: "Payment",
    body: "Rentals are paid in advance through SSLCommerz. The total includes the daily rate multiplied by the number of days and the quantity rented. Bookings are confirmed only after payment is verified.",
  },
  {
    title: "Cancellations",
    body: "You can cancel a booking from your dashboard before it is picked up, depending on its status. Whether a refund applies depends on the order status at cancellation time — contact support for specific cases.",
  },
  {
    title: "Damages & returns",
    body: "Inspect gear at pickup and report any existing damage to the provider immediately. Return gear clean and in the same condition you received it. Charges for new damage may apply and are decided between you and the provider.",
  },
  {
    title: "Provider responsibility",
    body: "Providers are responsible for listing accurate details, maintaining gear in safe, working condition, and honoring confirmed bookings. Misleading listings or unfulfilled bookings may be moderated by our team.",
  },
]

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The ground rules for renting and listing gear on GearUp.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-heading text-xl font-semibold tracking-wide">
              {section.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-12 rounded-md border border-border bg-muted/40 p-6 text-sm text-muted-foreground leading-relaxed">
        Have a question about a specific policy?{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Contact us
        </Link>
        .
      </p>
    </div>
  )
}
