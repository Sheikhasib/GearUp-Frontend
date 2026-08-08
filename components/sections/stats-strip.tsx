interface StatsStripProps {
  stats: {
    totalGear: number
    totalCategories: number
    totalReviews: number
    avgRating: number
  }
}

const formatRating = (value: number) => value.toFixed(1)

export function StatsStrip({ stats }: StatsStripProps) {
  const items = [
    { label: "Gear items", value: stats.totalGear },
    { label: "Categories", value: stats.totalCategories },
    { label: "Reviews", value: stats.totalReviews },
    { label: "Average rating", value: stats.avgRating ? formatRating(stats.avgRating) : "—" },
  ]

  return (
    <section className="bg-accent-solid py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {items.map((item) => (
            <div key={item.label}>
              <p className="font-heading text-4xl font-bold tabular-nums text-accent-solid-foreground">
                {item.value}
              </p>
              <p className="mt-2 text-xs font-semibold tracking-widest uppercase text-accent-solid-foreground/70">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
