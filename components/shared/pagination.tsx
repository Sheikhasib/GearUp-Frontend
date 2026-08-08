"use client"

import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

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

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pageItems = getPageItems(page, totalPages)

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <CaretLeft size={16} />
      </Button>

      {pageItems.map((item, index) =>
        item === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            type="button"
            variant={item === page ? "default" : "outline"}
            size="icon-sm"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className="min-w-9"
          >
            {item}
          </Button>
        )
      )}

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <CaretRight size={16} />
      </Button>
    </nav>
  )
}
