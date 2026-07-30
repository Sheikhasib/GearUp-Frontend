"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, House, MagnifyingGlass } from "@phosphor-icons/react"

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const rotateX = (clientY - centerY) * 0.02
      const rotateY = (clientX - centerX) * -0.02

      setMousePosition({ x: rotateX, y: rotateY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted px-4 py-20">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* 404 Number with 3D effect */}
        <div
          className="mb-8 transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg)`,
          }}
        >
          <div
            className={`bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-9xl font-black text-transparent transition-all duration-1000 md:text-[180px] ${
              isLoaded ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            404
          </div>
        </div>

        {/* Content */}
        <div
          className={`transition-all delay-200 duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Page not found
          </h1>

          <p className="mx-auto mb-8 max-w-lg text-lg text-muted-foreground">
            Oops! The page you&apos;re looking for has ventured into the digital
            void. Let&apos;s get you back on track.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="group relative inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            >
              <House className="h-5 w-5" />
              Back to Home
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              onClick={() => window.history.back()}
              className="group relative inline-flex items-center gap-2 rounded-lg border-2 border-primary px-8 py-3 font-semibold text-primary transition-all duration-300 hover:bg-primary/5"
            >
              <MagnifyingGlass className="h-5 w-5" />
              Go Back
            </button>
          </div>

          {/* Decorative suggestion */}
          <div className="text-sm text-muted-foreground">
            <p>
              Did you mean:{" "}
              <Link
                href="/"
                className="font-medium text-primary transition-colors hover:underline"
              >
                Homepage
              </Link>
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/3 left-0 h-2 w-2 animate-bounce rounded-full bg-primary" />
        <div className="absolute top-1/2 right-0 h-1.5 w-1.5 animate-bounce rounded-full bg-accent delay-100" />
        <div className="absolute bottom-1/3 left-1/4 h-2 w-2 animate-bounce rounded-full bg-primary/50 delay-200" />
      </div>
    </div>
  )
}
