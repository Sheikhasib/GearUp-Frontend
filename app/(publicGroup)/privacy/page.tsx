import Link from "next/link"

const sections = [
  {
    title: "Summary",
    body: "This page summarizes how GearUp handles your personal information. It is a plain-language overview of our practices — not legal advice. By using GearUp, you agree to the collection and use of data as described here.",
  },
  {
    title: "Data we collect",
    body: "We collect the information you provide when you register (name, email, phone), profile details you choose to add (including a profile photo), and records of your rentals, payments, and reviews. Providers additionally provide listing information about the gear they offer.",
  },
  {
    title: "How we use your data",
    body: "We use your data to operate the marketplace: creating and managing rental bookings, processing payments, moderating content, resolving disputes, and communicating with you about your account and orders. We do not sell your personal information.",
  },
  {
    title: "Cookies",
    body: "We use cookies to keep you signed in and to remember your preferences. Authentication tokens are stored in cookies so you stay logged in across pages. You can clear cookies through your browser, but some features may stop working.",
  },
  {
    title: "Payments",
    body: "Payments are processed by SSLCommerz, a third-party payment gateway. We do not store your card details. Transaction records and gateway references are kept to support refunds and disputes.",
  },
  {
    title: "Data sharing",
    body: "Your name and contact details are shared with providers when you rent their gear so they can coordinate pickup and return. Providers' contact details are shared with you for the same reason. We otherwise do not share your data except where required by law.",
  },
  {
    title: "Your rights & contact",
    body: "You can review and update your profile at any time. To request deletion of your account or data, contact us and we will respond within a reasonable time. Contact us via the contact page for any privacy question.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A summary of how GearUp handles your data. For questions, please
          contact our support team.
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
        Questions about your data?{" "}
        <Link href="/contact" className="text-primary hover:underline">
          Contact us
        </Link>
        .
      </p>
    </div>
  )
}
