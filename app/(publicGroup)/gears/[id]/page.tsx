import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "@phosphor-icons/react/ssr"
import { BackButton } from "./BackButton"
import { GearImageGallery } from "../../_components/gear/GearImageGallery"
import { RentNowPanel } from "../../_components/gear/RentNowPanel"
import { ReviewItem } from "../../_components/gear/ReviewItem"
import type { IGearItem, IReview } from "@/lib/types"

const API_URL = process.env.BACKEND_API_URL || "http://localhost:4000"

async function getGearById(id: string): Promise<IGearItem | null> {
  try {
    const res = await fetch(`${API_URL}/api/gear/${id}`, { cache: "no-cache" })
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? null
  } catch {
    return null
  }
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const gear = await getGearById(id)

  if (!gear) notFound()

  const reviews = gear.reviews as IReview[] | undefined
  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-background/80 backdrop-blur-lg mb-6">
        <BackButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          <GearImageGallery images={gear.images} />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {gear.category && (
                <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground border border-border px-2 py-0.5">
                  {gear.category.name}
                </span>
              )}
              {!gear.isAvailable && (
                <span className="text-[10px] font-semibold tracking-widest uppercase text-destructive border border-destructive/30 px-2 py-0.5">
                  Unavailable
                </span>
              )}
              {gear.isAvailable && gear.availableQuantity > 0 && (
                <span className="text-[10px] font-semibold tracking-widest uppercase text-primary border border-primary/30 px-2 py-0.5">
                  Available
                </span>
              )}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              {gear.name}
            </h1>

            {gear.brand && (
              <p className="text-sm tracking-widest uppercase text-muted-foreground">
                {gear.brand}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm">
              {avgRating && (
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-500 font-semibold">{avgRating}</span>
                  <span className="text-muted-foreground">
                    ({reviews!.length} {reviews!.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}
              {gear.provider && (
                <span className="text-muted-foreground">
                  by <span className="font-medium text-foreground">{gear.provider.name}</span>
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {gear.description}
            </p>
          </div>

          {reviews && reviews.length > 0 && (
            <div className="space-y-4 border-t border-border pt-8">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold tracking-tight">
                  Reviews ({reviews.length})
                </h2>
                <Link
                  href={`/gears/${id}/reviews`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View all reviews
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewItem
                    key={review.id}
                    name={review.customer?.name ?? "Anonymous"}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <RentNowPanel gear={gear} />
        </div>
      </div>
    </div>
  )
}
