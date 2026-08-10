"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { IRevenuePoint } from "@/lib/types"
import { useChartTokens } from "./use-chart-tokens"

interface RevenueLineChartProps {
  data: IRevenuePoint[]
}

export function RevenueLineChart({ data }: RevenueLineChartProps) {
  const tokens = useChartTokens()
  const color = tokens["--color-primary"] || "currentColor"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
      >
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => value.slice(5)}
          stroke="currentColor"
          className="text-muted-foreground"
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(value) => `$${value}`}
          stroke="currentColor"
          className="text-muted-foreground"
        />
        <Tooltip
          formatter={(value) => [`$${value}`, "Revenue"]}
          contentStyle={{
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 0,
            color: "var(--color-popover-foreground)",
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={color}
          strokeWidth={2}
          fill="url(#revenue-fill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
