"use client"

import { useEffect, useMemo, useState } from "react"
import { useContactMessages } from "../../_hooks/useContact"
import { Pagination } from "@/components/shared/pagination"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { IContactMessage } from "@/lib/types"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return format(date, "MMM d, yyyy")
}

export function ContactMessagesTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading, isError } = useContactMessages(
    page,
    debouncedSearch || undefined
  )

  const messages = useMemo(() => data?.data ?? [], [data])
  const totalPages = Math.max(1, data?.meta?.totalPages ?? 1)

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search messages…"
        className="h-10 w-full max-w-xs rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 focus:ring-1 focus:ring-primary"
      />

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-md bg-muted" />
      ) : isError ? (
        <div className="rounded-md border border-border py-20 text-center">
          <p className="text-sm text-muted-foreground">Failed to load messages.</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-md border border-border py-20 text-center">
          <p className="text-lg text-foreground">No messages yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact form submissions appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-md border border-border bg-card sm:block">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Name
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Email
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Subject
                  </th>
                  <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Message
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Received
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {messages.map((message) => (
                  <MessageRow
                    key={message.id}
                    message={message}
                    expanded={expandedId === message.id}
                    onToggle={() =>
                      setExpandedId((current) =>
                        current === message.id ? null : message.id
                      )
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 sm:hidden">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                expanded={expandedId === message.id}
                onToggle={() =>
                  setExpandedId((current) =>
                    current === message.id ? null : message.id
                  )
                }
              />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

interface MessageRowProps {
  message: IContactMessage
  expanded: boolean
  onToggle: () => void
}

function MessageRow({ message, expanded, onToggle }: MessageRowProps) {
  return (
    <tr className="align-top transition-colors hover:bg-muted/30">
      <td className="px-5 py-4 font-medium">{message.name}</td>
      <td className="px-5 py-4 text-muted-foreground">{message.email}</td>
      <td className="px-5 py-4 font-medium">{message.subject}</td>
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={onToggle}
          className="cursor-pointer text-left text-muted-foreground"
        >
          <span
            className={cn(
              "block",
              !expanded && "max-w-56 truncate"
            )}
          >
            {message.message}
          </span>
          {message.message.length > 60 && (
            <span className="text-[10px] font-semibold tracking-widest uppercase text-primary">
              {expanded ? "Show less" : "Show more"}
            </span>
          )}
        </button>
      </td>
      <td className="px-5 py-4 text-right text-xs text-muted-foreground whitespace-nowrap">
        {formatDate(message.createdAt)}
      </td>
    </tr>
  )
}

function MessageCard({ message, expanded, onToggle }: MessageRowProps) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">{message.name}</p>
          <p className="text-sm text-muted-foreground">{message.email}</p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDate(message.createdAt)}
        </span>
      </div>
      <p className="mt-2 font-medium">{message.subject}</p>
      <button
        type="button"
        onClick={onToggle}
        className="mt-1 cursor-pointer text-left text-sm text-muted-foreground"
      >
        <span className={cn("block", !expanded && "line-clamp-2")}>
          {message.message}
        </span>
        {message.message.length > 60 && (
          <span className="text-[10px] font-semibold tracking-widest uppercase text-primary">
            {expanded ? "Show less" : "Show more"}
          </span>
        )}
      </button>
    </div>
  )
}
