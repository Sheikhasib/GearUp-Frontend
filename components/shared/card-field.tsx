import type { ReactNode } from "react"

interface CardFieldProps {
  label: string
  children: ReactNode
  className?: string
}

export function CardField({ label, children, className }: CardFieldProps) {
  return (
    <div className={className}>
      <dt className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-foreground">{children}</dd>
    </div>
  )
}
