import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/ssr"
import type { ICategory } from "@/lib/types"

interface CategoryCount {
  category: ICategory
  count: number
}

export function CategoryGrid({ categories }: { categories: CategoryCount[] }) {
  if (categories.length === 0) return null

  return (
    <section id="categories" className="scroll-mt-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Browse by Category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find the right gear for your ride
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(({ category, count }) => (
          <Link
            key={category.id}
            href={`/gears?categoryId=${category.id}`}
            className="group flex flex-col gap-2 bg-card p-6 ring-1 ring-foreground/5 transition-all duration-300 hover:ring-primary/30 hover:shadow-lg hover:-translate-y-0.5"
          >
            <span className="text-[10px] font-semibold tracking-widest uppercase text-accent-solid">
              {count} {count === 1 ? "item" : "items"}
            </span>
            <span className="font-heading text-lg font-semibold tracking-wide truncate group-hover:text-primary transition-colors">
              {category.name}
            </span>
            <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase text-primary">
              Browse <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
