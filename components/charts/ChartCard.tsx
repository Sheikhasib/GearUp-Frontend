"use client"

import type { ReactNode } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartCardProps {
  title: string
  description?: string
  loading?: boolean
  error?: boolean
  empty?: boolean
  children: ReactNode
}

export function ChartCard({
  title,
  description,
  loading,
  error,
  empty,
  children,
}: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full rounded-none" />
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Failed to load data.
          </div>
        ) : empty ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Not enough data yet.
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
