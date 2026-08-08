"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PencilLine, Trash, Check, X } from "@phosphor-icons/react"
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories"
import { useAdminGears } from "../../_hooks/useAdmin"
import { categorySchema, type CategoryInput } from "@/lib/validations/category"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardField } from "@/components/shared/card-field"

export function CategoryManager() {
  const { data: categories, isLoading } = useCategories()
  const { data: gears } = useAdminGears()
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string
    name: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  })

  const gearCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const gear of gears ?? []) {
      counts[gear.categoryId] = (counts[gear.categoryId] ?? 0) + 1
    }
    return counts
  }, [gears])

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-md bg-muted" />
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="rounded-md border border-border py-20 text-center">
        <p className="text-lg text-foreground">No categories yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add the first category below.
        </p>
      </div>
    )
  }

  const onCreate = (data: CategoryInput) => {
    createCategory(data.name, {
      onSuccess: () => reset(),
    })
  }

  const onEditSave = () => {
    if (!editingId || !editingName.trim()) return
    updateCategory(
      { id: editingId, name: editingName.trim() },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditingName("")
        },
      }
    )
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onCreate)}
        className="mb-6 flex max-w-md items-start gap-3"
      >
        <div className="flex-1">
          <Input
            placeholder="New category name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isCreating} className="cursor-pointer">
          {isCreating ? "Adding..." : "Add"}
        </Button>
      </form>

      <div className="hidden overflow-x-auto rounded-md border border-border bg-card sm:block">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Category
              </th>
              <th className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Slug
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Gear Items
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category) => {
              const gearCount = gearCountByCategory[category.id] ?? 0
              const isEditing = editingId === category.id
              const isInUse = gearCount > 0

              return (
                <tr key={category.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-4">
                    {isEditing ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        className="sm:w-64"
                      />
                    ) : (
                      <span className="font-medium">{category.name}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {category.slug}
                  </td>
                  <td className="px-5 py-4 text-center">{gearCount}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            disabled={isUpdating || !editingName.trim()}
                            onClick={onEditSave}
                          >
                            <Check />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingId(null)
                              setEditingName("")
                            }}
                          >
                            <X />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingId(category.id)
                              setEditingName(category.name)
                            }}
                          >
                            <PencilLine />
                            Edit
                          </Button>

                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {isInUse ? (
                                  <span className="inline-flex">
                                    <Button variant="destructive" size="sm" disabled>
                                      <Trash />
                                      Delete
                                    </Button>
                                  </span>
                                ) : (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      setCategoryToDelete({
                                        id: category.id,
                                        name: category.name,
                                      })
                                    }
                                  >
                                    <Trash />
                                    Delete
                                  </Button>
                                )}
                              </TooltipTrigger>
                              {isInUse && (
                                <TooltipContent>
                                  In use by {gearCount} gear item
                                  {gearCount === 1 ? "" : "s"}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 sm:hidden">
        {categories.map((category) => {
          const gearCount = gearCountByCategory[category.id] ?? 0
          const isEditing = editingId === category.id
          const isInUse = gearCount > 0

          return (
            <div key={category.id} className="rounded-md border border-border bg-card p-4">
              <div>
                {isEditing ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    className="w-full"
                  />
                ) : (
                  <p className="font-medium">{category.name}</p>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {category.slug}
                </p>
              </div>

              <dl className="mt-3 grid grid-cols-1 gap-3">
                <CardField label="Gear Items">{gearCount}</CardField>
              </dl>

              <div className="mt-3 border-t border-border pt-3">
                {isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      disabled={isUpdating || !editingName.trim()}
                      onClick={onEditSave}
                    >
                      <Check />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(null)
                        setEditingName("")
                      }}
                    >
                      <X />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(category.id)
                        setEditingName(category.name)
                      }}
                    >
                      <PencilLine />
                      Edit
                    </Button>

                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {isInUse ? (
                            <span className="inline-flex">
                              <Button variant="destructive" size="sm" disabled>
                                <Trash />
                                Delete
                              </Button>
                            </span>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setCategoryToDelete({
                                  id: category.id,
                                  name: category.name,
                                })
                              }
                            >
                              <Trash />
                              Delete
                            </Button>
                          )}
                        </TooltipTrigger>
                        {isInUse && (
                          <TooltipContent>
                            In use by {gearCount} gear item
                            {gearCount === 1 ? "" : "s"}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{categoryToDelete?.name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={() => {
                  if (!categoryToDelete) return
                  deleteCategory(categoryToDelete.id, {
                    onSuccess: () => setCategoryToDelete(null),
                  })
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
