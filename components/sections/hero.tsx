"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { CaretDown } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import type { IGearItem } from "@/lib/types"

interface HeroSectionProps {
  items: IGearItem[]
}

export function HeroSection({ items }: HeroSectionProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (items.length <= 1 || paused) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [items.length, paused])

  const current = items[index]

  return (
    <section
      className="relative flex min-h-[60svh] max-h-[70svh] items-center overflow-hidden bg-gradient-to-b from-primary/5 to-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {current?.images?.[0] && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={current.images[0]}
                alt={current.name}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9]">
            Gear Up for
            <span className="text-primary block mt-2">Your Next Ride</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
            Rent premium cycling gear from local providers. Bikes, accessories, and equipment — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/gears">Browse Gear</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/gears">Explore</Link>
            </Button>
          </div>
        </div>

        {current && (
          <div className="mt-8 flex max-w-xs items-center gap-3 bg-background/80 backdrop-blur-sm px-4 py-3 ring-1 ring-foreground/10">
            {current.images?.[0] && (
              <Image
                src={current.images[0]}
                alt={current.name}
                width={56}
                height={42}
                className="h-[42px] w-14 object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{current.name}</p>
              <p className="text-xs text-muted-foreground">
                ${current.priceRatePerDay}
                <span className="ml-0.5">/day</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <Link
        href="#categories"
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-muted-foreground transition-colors hover:text-primary"
        aria-label="Scroll to categories"
      >
        <CaretDown size={28} className="animate-bounce" />
      </Link>
    </section>
  )
}
