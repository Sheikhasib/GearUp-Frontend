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
import type { IUsersByRole } from "@/lib/types"
import { useChartTokens } from "./use-chart-tokens"

const ROLE_TOKENS: Record<string, string> = {
  ADMIN: "--color-chart-5",
  PROVIDER: "--color-chart-3",
  CUSTOMER: "--color-chart-1",
}

interface UsersByRoleChartProps {
  data: IUsersByRole[]
}

export function UsersByRoleChart({ data }: UsersByRoleChartProps) {
  const tokens = useChartTokens()

  const fill = (role: string) =>
    tokens[ROLE_TOKENS[role] as keyof typeof tokens] ?? "var(--color-muted)"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="role"
          tick={{ fontSize: 12 }}
          width={80}
        />
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{
            background: "var(--color-popover)",
            border: "1px solid var(--color-border)",
            borderRadius: 0,
            color: "var(--color-popover-foreground)",
          }}
        />
        <Bar dataKey="count" radius={[0, 2, 2, 0]}>
          {data.map((entry) => (
            <Cell key={entry.role} fill={fill(entry.role)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
