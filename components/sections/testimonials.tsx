import { Star } from "@phosphor-icons/react/ssr"

export interface Testimonial {
  name: string
  rating: number
  comment: string
}

export function TestimonialGrid({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight">
          What Renters Say
        </h2>
        <p className="mt-2 text-muted-foreground">
          Real reviews from riders just like you
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <figure key={`${t.name}-${i}`} className="flex flex-col gap-3 p-6 bg-card ring-1 ring-foreground/5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  weight={star <= t.rating ? "fill" : "regular"}
                  className={
                    star <= t.rating ? "text-accent-solid" : "text-muted-foreground/30"
                  }
                />
              ))}
            </div>
            <blockquote className="text-sm text-muted-foreground leading-relaxed">
              &ldquo;{t.comment}&rdquo;
            </blockquote>
            <figcaption className="mt-auto pt-2 text-xs font-semibold tracking-widest uppercase text-primary">
              {t.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
