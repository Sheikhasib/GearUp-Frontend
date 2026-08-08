import Link from "next/link"
import { fetchCategories } from "@/lib/api/categories"
import { fetchGear, fetchGearById } from "@/lib/api/gear"
import { HeroSection } from "@/components/sections/hero"
import { CategoryGrid } from "@/components/sections/category-grid"
import { HowItWorks } from "@/components/sections/how-it-works"
import { StatsStrip } from "@/components/sections/stats-strip"
import { TestimonialGrid } from "@/components/sections/testimonials"
import { FaqSection } from "@/components/sections/faq"
import { CtaBand } from "@/components/sections/cta-band"
import { GearCard } from "./_components/gear/GearCard"
import type { IGearItem, ICategory, IReview } from "@/lib/types"

interface EnrichedGear extends IGearItem {
  rating: number
  reviewCount: number
}

async function getFeaturedGear(): Promise<IGearItem[]> {
  try {
    const { items } = await fetchGear({ limit: 6 })
    return items ?? []
  } catch {
    return []
  }
}

function averageRating(reviews?: IReview[]): number {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedGear(),
    fetchCategories().catch(() => [] as ICategory[]),
  ])

  const [categoryCounts, featuredDetails, totalMeta] = await Promise.all([
    Promise.all(
      categories.map(async (category) => {
        try {
          const { meta } = await fetchGear({ categoryId: category.id, limit: 1 })
          return { category, count: meta?.total ?? 0 }
        } catch {
          return { category, count: 0 }
        }
      })
    ),
    Promise.all(
      featured.map(async (gear) => {
        try {
          return await fetchGearById(gear.id)
        } catch {
          return null
        }
      })
    ),
    fetchGear({ limit: 1 }).catch(() => ({ meta: undefined })),
  ])

  const enriched: EnrichedGear[] = featured.map((gear, i) => {
    const detail = featuredDetails[i]
    const reviews = detail?.reviews ?? []
    return {
      ...gear,
      reviews,
      rating: averageRating(reviews),
      reviewCount: reviews.length,
    }
  })

  const allReviews = featuredDetails.flatMap((d) => d?.reviews ?? [])
  const testimonials = allReviews
    .slice(0, 5)
    .map((r) => ({
      name: r.customer?.name ?? "Anonymous",
      rating: r.rating,
      comment: r.comment ?? "",
    }))
    .filter((t) => t.comment.length > 0)

  const stats = {
    totalGear: totalMeta.meta?.total ?? 0,
    totalCategories: categories.length,
    totalReviews: allReviews.length,
    avgRating: averageRating(allReviews),
  }

  return (
    <>
      <HeroSection items={enriched.slice(0, 3)} />

      <CategoryGrid categories={categoryCounts} limit={6} showViewAll />

      {enriched.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight">
                Featured Gear
              </h2>
              <p className="mt-2 text-muted-foreground">
                Top picks from our providers
              </p>
            </div>
            <Link
              href="/gears"
              className="text-xs font-semibold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enriched.map((gear) => (
              <GearCard
                key={gear.id}
                gear={gear}
                rating={gear.rating}
                reviewCount={gear.reviewCount}
              />
            ))}
          </div>
        </section>
      )}

      <HowItWorks />

      <StatsStrip stats={stats} />

      <TestimonialGrid testimonials={testimonials} />

      <FaqSection />

      <CtaBand />
    </>
  )
}
