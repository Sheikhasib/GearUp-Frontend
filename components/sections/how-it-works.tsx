import { MagnifyingGlass, CalendarCheck, Package } from "@phosphor-icons/react/ssr"

const steps = [
  {
    icon: MagnifyingGlass,
    title: "Search gear",
    text: "Browse bikes and accessories from local providers and filter by dates, price, and category.",
  },
  {
    icon: CalendarCheck,
    title: "Book dates & confirm",
    text: "Pick your rental window, review the total, and confirm your booking in a few clicks.",
  },
  {
    icon: Package,
    title: "Pick up / return",
    text: "Collect your gear when the rental starts and return it when it ends.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Renting is as easy as 1-2-3
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center gap-3 p-8 text-center bg-card ring-1 ring-foreground/5">
              <div className="flex size-14 items-center justify-center bg-accent-solid/10 text-accent-solid">
                <step.icon size={28} />
              </div>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                Step {i + 1}
              </span>
              <h3 className="font-heading text-lg font-semibold tracking-wide">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
