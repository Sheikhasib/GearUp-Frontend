"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useTheme } from "next-themes"
import type { IOrdersByStatus } from "@/lib/types"
import { STATUS_CHART_COLORS } from "@/lib/chartColors"
import { STATUS_LABELS } from "@/lib/badgeStyles"

interface StatusDonutChartProps {
  data: IOrdersByStatus[]
}

export function StatusDonutChart({ data }: StatusDonutChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const colorFor = (status: string) =>
    STATUS_CHART_COLORS[status]?.[isDark ? "dark" : "light"] ??
    "var(--color-muted)"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={colorFor(entry.status)}
              name={STATUS_LABELS[entry.status] ?? entry.status}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 0,
            color: "var(--color-popover-foreground)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
