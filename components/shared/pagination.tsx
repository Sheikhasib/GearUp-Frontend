"use client"

import { CaretLeft, CaretRight } from "@phosphor-icons/react"

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

const pageButtonClass =
  "inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border border-border px-2 text-sm transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
const activePageClass = "bg-primary text-primary-foreground border-primary hover:bg-primary/90"

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pageItems = getPageItems(page, totalPages)

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={pageButtonClass}
        aria-label="Previous page"
      >
        <CaretLeft size={16} />
      </button>

      {pageItems.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${pageButtonClass} ${item === page ? activePageClass : ""}`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={pageButtonClass}
        aria-label="Next page"
      >
        <CaretRight size={16} />
      </button>
    </nav>
  )
}
