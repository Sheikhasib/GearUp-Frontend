import Link from "next/link"
import { notFound } from "next/navigation"
import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr"
import { GoBackButton } from "@/components/shared/go-back-button"
import { fetchGearReviewsServer } from "@/service/fetchGearReviewsServer"
import { ReviewItem } from "../../../_components/gear/ReviewItem"
import type { IGearItem } from "@/lib/types"

const API_URL = process.env.BACKEND_API_URL || "http://localhost:4000"
const LIMIT = 10

async function getGear(id: string): Promise<IGearItem | null> {
  try {
    const res = await fetch(`${API_URL}/api/gear/${id}`, { cache: "no-cache" })
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? null
  } catch {
    return null
  }
}

function getPageItems(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = new Set<number>([
    1,
    2,
    current - 1,
    current,
    current + 1,
    total - 1,
    total,
  ])
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)

  const items: (number | "...")[] = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) items.push("...")
    items.push(p)
    prev = p
  }
  return items
}

const pageLinkClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-2 text-sm transition-colors hover:bg-muted"
const activePageClass =
  "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
const disabledClass = "pointer-events-none opacity-40"

const GearReviewsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) => {
  const { id } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const [gear, reviewsData] = await Promise.all([
    getGear(id),
    fetchGearReviewsServer(id, page, LIMIT),
  ])

  if (!gear) notFound()

  const reviews = reviewsData?.data ?? []
  const total = reviewsData?.meta.total ?? 0
  const totalPages = Math.max(1, reviewsData?.meta.totalPages ?? 1)
  const pageItems = getPageItems(page, totalPages)

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <GoBackButton label={`Back to ${gear.name}`} />
      <div className="mb-8" />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Reviews
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {gear.name} · {total} {total === 1 ? "review" : "reviews"}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-md border border-border bg-card py-20 text-center">
          <p className="text-lg text-foreground">No reviews yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Rent this gear and be the first to share your experience.
          </p>
        </div>
      ) : (
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
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2">
          <Link
            href={`/gears/${id}/reviews?page=${page - 1}`}
            className={`${pageLinkClass} ${page <= 1 ? disabledClass : ""}`}
            aria-label="Previous page"
          >
            <CaretLeft size={16} />
          </Link>

          {pageItems.map((item, index) =>
            item === "..." ? (
              <span key={`ellipsis-${index}`} className="px-1 text-muted-foreground">
                …
              </span>
            ) : (
              <Link
                key={item}
                href={`/gears/${id}/reviews?page=${item}`}
                className={`${pageLinkClass} ${item === page ? activePageClass : ""}`}
              >
                {item}
              </Link>
            )
          )}

          <Link
            href={`/gears/${id}/reviews?page=${page + 1}`}
            className={`${pageLinkClass} ${page >= totalPages ? disabledClass : ""}`}
            aria-label="Next page"
          >
            <CaretRight size={16} />
          </Link>
        </nav>
      )}
    </div>
  )
}

export default GearReviewsPage
