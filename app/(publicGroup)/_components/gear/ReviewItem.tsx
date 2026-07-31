import { Star } from "@phosphor-icons/react/ssr"

interface ReviewItemProps {
  name: string
  rating: number
  comment?: string
  createdAt?: string
}

const formatDate = (value?: string) => {
  if (!value) return null
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function ReviewItem({ name, rating, comment, createdAt }: ReviewItemProps) {
  return (
    <div className="p-4 ring-1 ring-foreground/5 bg-muted/30">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium">{name}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                weight={star <= rating ? "fill" : "regular"}
                className={
                  star <= rating ? "text-amber-400" : "text-muted-foreground/30"
                }
              />
            ))}
          </span>
          {formatDate(createdAt) && (
            <span className="text-xs text-muted-foreground">
              {formatDate(createdAt)}
            </span>
          )}
        </span>
      </div>
      {comment && <p className="text-sm text-muted-foreground">{comment}</p>}
    </div>
  )
}
