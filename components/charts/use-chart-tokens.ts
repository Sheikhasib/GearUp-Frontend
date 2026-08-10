"use client"

import { useMemo } from "react"
import { useTheme } from "next-themes"

const TOKENS = [
  "--color-primary",
  "--color-chart-1",
  "--color-chart-2",
  "--color-chart-3",
  "--color-chart-4",
  "--color-chart-5",
] as const

export type ChartToken = (typeof TOKENS)[number]

function readToken(token: ChartToken): string {
  if (typeof document === "undefined") return ""
  const el = document.createElement("div")
  el.style.color = `var(${token})`
  document.body.appendChild(el)
  const color = getComputedStyle(el).color
  el.remove()
  return color
}

// Resolves design-system token values to concrete colors the SVG can render,
// recalculated when the theme switches so charts follow light/dark mode.
export function useChartTokens() {
  const { resolvedTheme } = useTheme()
  // resolvedTheme is intentionally the only dependency: when it flips, the
  // token values below get re-read from the freshly-applied stylesheet.
  return useMemo(() => {
    if (typeof document === "undefined") return {} as Record<ChartToken, string>
    return Object.fromEntries(TOKENS.map((t) => [t, readToken(t)])) as Record<
      ChartToken,
      string
    >
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme])
}
