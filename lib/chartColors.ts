export const STATUS_CHART_COLORS: Record<
  string,
  { light: string; dark: string }
> = {
  PLACED: {
    light: "oklch(0.74 0.16 70)",
    dark: "oklch(0.78 0.16 70)",
  },
  CONFIRMED: {
    light: "oklch(0.62 0.19 256)",
    dark: "oklch(0.72 0.15 256)",
  },
  PAID: {
    light: "oklch(0.61 0.2 296)",
    dark: "oklch(0.72 0.15 296)",
  },
  PICKED_UP: {
    light: "oklch(0.68 0.17 152)",
    dark: "oklch(0.78 0.14 152)",
  },
  RETURNED: {
    light: "oklch(0.6 0.01 256)",
    dark: "oklch(0.72 0.01 256)",
  },
  CANCELLED: {
    light: "oklch(0.62 0.22 27)",
    dark: "oklch(0.72 0.18 27)",
  },
}
