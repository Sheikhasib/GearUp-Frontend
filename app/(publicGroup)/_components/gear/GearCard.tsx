"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bicycle } from "@phosphor-icons/react"
import type { IGearItem } from "@/lib/types"

export function GearCard({ gear }: { gear: IGearItem }) {
  const [imgError, setImgError] = useState(false)
  const imageUrl = gear.images?.[0]

  return (
    <div className="group/card flex flex-col bg-card ring-1 ring-foreground/5 transition-all duration-300 hover:ring-primary/30 hover:shadow-lg hover:-translate-y-0.5">
      <Link
        href={`/gears/${gear.id}`}
        className="block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={gear.name}
              fill
              className="object-cover transition-all duration-500 group-hover/card:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Bicycle size={48} className="text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
          {!gear.isAvailable && (
            <span className="absolute top-2 left-2 bg-destructive/90 text-destructive-foreground text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5">
              Unavailable
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center gap-2">
          {gear.category && (
            <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
              {gear.category.name}
            </span>
          )}
          <span className="ml-auto font-heading text-lg font-bold tabular-nums text-primary">
            ${gear.priceRatePerDay}
            <span className="text-[10px] font-normal text-muted-foreground">/day</span>
          </span>
        </div>

        <Link href={`/gears/${gear.id}`}>
          <h3 className="font-heading text-sm font-semibold tracking-wide truncate hover:text-primary transition-colors">
            {gear.name}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {gear.description}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          {gear.provider && (
            <p className="text-[10px] tracking-wider uppercase text-muted-foreground">
              by {gear.provider.name}
            </p>
          )}
          <Link
            href={`/gears/${gear.id}`}
            className="text-[10px] font-semibold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
