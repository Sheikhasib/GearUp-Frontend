"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { IGearByCategory } from "@/lib/types"
import { useChartTokens } from "./use-chart-tokens"

const CHART_TOKENS = [
  "--color-chart-1",
  "--color-chart-2",
  "--color-chart-3",
  "--color-chart-4",
  "--color-chart-5",
] as const

interface CategoryBarChartProps {
  data: IGearByCategory[]
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  const tokens = useChartTokens()

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 11 }}
          stroke="currentColor"
          className="text-muted-foreground"
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          stroke="currentColor"
          className="text-muted-foreground"
        />
        <Tooltip
          formatter={(value) => [value, "Items"]}
          contentStyle={{
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 0,
            color: "var(--color-popover-foreground)",
          }}
        />
        <Bar dataKey="count" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.category}
              fill={tokens[CHART_TOKENS[index % CHART_TOKENS.length]]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
