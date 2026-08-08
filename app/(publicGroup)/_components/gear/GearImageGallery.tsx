"use client"

import { useState } from "react"
import Image from "next/image"
import { Bicycle } from "@phosphor-icons/react"

export function GearImageGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0)
  const [imgError, setImgError] = useState<Record<number, boolean>>({})

  const validImages = images?.filter(Boolean) ?? []

  if (!validImages.length) {
    return (
      <div className="aspect-square bg-muted flex items-center justify-center">
        <Bicycle size={64} className="text-muted-foreground/20" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imgError[selected] ? (
          <div className="flex h-full items-center justify-center">
            <Bicycle size={64} className="text-muted-foreground/20" />
          </div>
        ) : (
          <Image
            src={validImages[selected]}
            alt=""
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onError={() => setImgError((p) => ({ ...p, [selected]: true }))}
          />
        )}
      </div>
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative shrink-0 w-16 h-16 overflow-hidden ring-1 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                i === selected
                  ? "ring-primary ring-2 opacity-100"
                  : "ring-foreground/10 opacity-60 hover:opacity-100"
              }`}
            >
              {imgError[i] ? (
                <div className="flex h-full items-center justify-center bg-muted">
                  <Bicycle size={20} className="text-muted-foreground/30" />
                </div>
              ) : (
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                  onError={() => setImgError((p) => ({ ...p, [i]: true }))}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
