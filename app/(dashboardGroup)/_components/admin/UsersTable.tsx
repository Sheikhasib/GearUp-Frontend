"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAdminUsers, useUpdateUserStatus } from "../../_hooks/useAdmin"
import { USER_STATUS_LABELS, USER_STATUS_STYLES } from "@/lib/badgeStyles"
import type { UserStatus } from "@/lib/types"
import { CardField } from "@/components/shared/card-field"

const PAGE_SIZE = 10
const ROLE_FILTERS = ["all", "CUSTOMER", "PROVIDER", "ADMIN"] as const
type RoleFilter = (typeof ROLE_FILTERS)[number]

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export function UsersTable() {
  const [role, setRole] = useState<RoleFilter>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [target, setTarget] = useState<{
    id: string
    name: string
    status: UserStatus
  } | null>(null)

  const filterKey = `${role}|${search.trim()}`
  const [lastFilterKey, setLastFilterKey] = useState(filterKey)
  if (lastFilterKey !== filterKey) {
    setLastFilterKey(filterKey)
    setPage(1)
  }

  const { data: users, isLoading } = useAdminUsers(
    role === "all" ? undefined : role
  )
  const { mutate: updateStatus, isPending } = useUpdateUserStatus()

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users ?? []
    return (users ?? []).filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
  }, [users, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-muted" />
  }

  if (!users || users.length === 0) {
    return (
      <div className="rounded-md border border-border py-20 text-center">
        <p className="text-lg text-foreground">No users found</p>
      </div>
    )
  }

  const handleConfirm = () => {
    if (!target) return
    const nextStatus: UserStatus =
      target.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"

    updateStatus(
      { id: target.id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(
            nextStatus === "SUSPENDED"
              ? "User suspended"
              : "User activated"
          )
          setTarget(null)
        },
      }
    )
  }

  const isSuspend = target?.status === "ACTIVE"

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">
          {ROLE_FILTERS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs font-semibold tracking-widest uppercase transition-colors ${
                role === r
                  ? "border-border bg-foreground text-background"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="sm:w-64"
        />
      </div>

      <div className="hidden overflow-x-auto rounded-md border border-border bg-card sm:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                User
              </th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Email
              </th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Phone
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Role
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Status
              </th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Joined
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paged.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-4 font-medium">{user.name}</td>
                <td className="px-5 py-4 text-muted-foreground">{user.email}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {user.phone ?? "—"}
                </td>
                <td className="px-5 py-4 text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  {user.role}
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${USER_STATUS_STYLES[user.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}
                  >
                    {USER_STATUS_LABELS[user.status] || user.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(user.createdAt ?? "")}
                </td>
                <td className="px-5 py-4 text-right">
                  {user.role !== "ADMIN" && (
                    <Button
                      size="sm"
                      variant={user.status === "ACTIVE" ? "destructive" : "default"}
                      onClick={() =>
                        setTarget({
                          id: user.id,
                          name: user.name,
                          status: user.status,
                        })
                      }
                    >
                      {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {paged.map((user) => (
          <div key={user.id} className="rounded-md border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ${USER_STATUS_STYLES[user.status] || "bg-gray-50 text-gray-600 ring-gray-200"}`}>
                  {USER_STATUS_LABELS[user.status] || user.status}
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  {user.role}
                </span>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-3">
              <CardField label="Phone">{user.phone ?? "—"}</CardField>
              <CardField label="Joined">{formatDate(user.createdAt ?? "")}</CardField>
            </dl>

            {user.role !== "ADMIN" && (
              <div className="mt-3 border-t border-border pt-3">
                <Button
                  size="sm"
                  variant={user.status === "ACTIVE" ? "destructive" : "default"}
                  onClick={() =>
                    setTarget({
                      id: user.id,
                      name: user.name,
                      status: user.status,
                    })
                  }
                >
                  {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <CaretLeft />
            Prev
          </Button>
          <span className="px-2 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
            <CaretRight />
          </Button>
        </div>
      )}

      <AlertDialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSuspend ? "Suspend user?" : "Activate user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSuspend
                ? `Suspend ${target?.name}? They will not be able to sign in until reactivated.`
                : `Activate ${target?.name}? They will regain access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant={isSuspend ? "destructive" : "default"}
                disabled={isPending}
                onClick={handleConfirm}
              >
                {isPending ? "Saving..." : isSuspend ? "Suspend" : "Activate"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
