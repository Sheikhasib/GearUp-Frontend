"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { gearSchema, type GearInput } from "@/lib/validations/gear"
import { useCategories } from "@/hooks/useCategories"
import { useCreateGear, useUpdateGear } from "../../_hooks/useProvider"
import { GearImageUpload } from "../gear-image-upload"
import { Button } from "@/components/ui/button"

interface GearFormProps {
  mode: "create" | "edit"
  gearId?: string
  defaultValues?: Partial<GearInput>
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 focus:ring-1 focus:ring-primary"
const labelClass =
  "mb-1.5 block text-xs font-semibold tracking-widest uppercase text-muted-foreground"

export function GearForm({ mode, gearId, defaultValues }: GearFormProps) {
  const router = useRouter()
  const { data: categories } = useCategories()
  const { mutate: createGear, isPending: isCreating } = useCreateGear()
  const { mutate: updateGear, isPending: isUpdating } = useUpdateGear(gearId ?? "")

  const isPending = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<GearInput>({
    resolver: zodResolver(gearSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      categoryId: "",
      priceRatePerDay: 0,
      quantity: 1,
      images: [],
      isAvailable: true,
      ...defaultValues,
    },
  })

  const images = useWatch({ control, name: "images" }) ?? []
  const isAvailable = useWatch({ control, name: "isAvailable" })

  const onSubmit = (data: GearInput) => {
    const payload = {
      name: data.name,
      description: data.description,
      brand: data.brand || undefined,
      categoryId: data.categoryId,
      priceRatePerDay: data.priceRatePerDay,
      quantity: data.quantity,
      images: data.images,
      isAvailable: data.isAvailable,
    }

    const onSuccess = () => {
      toast.success(
        mode === "create" ? "Gear created successfully" : "Gear updated successfully"
      )
      router.push("/provider-dashboard/my-gear")
    }

    if (mode === "edit" && gearId) {
      updateGear(payload, { onSuccess })
    } else {
      createGear(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className={inputClass}
          placeholder="e.g. Mountain Bike Pro"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Describe the gear, condition, what's included..."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="brand" className={labelClass}>
            Brand
          </label>
          <input
            id="brand"
            {...register("brand")}
            className={inputClass}
            placeholder="e.g. Trek, Coleman"
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <select id="category" {...register("categoryId")} className={inputClass}>
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-xs text-destructive">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className={labelClass}>
            Price per day ($)
          </label>
          <input
            id="price"
            type="number"
            min={0}
            step={0.01}
            {...register("priceRatePerDay", { valueAsNumber: true })}
            className={inputClass}
          />
          {errors.priceRatePerDay && (
            <p className="mt-1 text-xs text-destructive">
              {errors.priceRatePerDay.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className={labelClass}>
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            step={1}
            {...register("quantity", { valueAsNumber: true })}
            className={inputClass}
          />
          {errors.quantity && (
            <p className="mt-1 text-xs text-destructive">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      <div>
        <span className={labelClass}>Images</span>
        <GearImageUpload
          images={images}
          onImagesChange={(urls) =>
            setValue("images", urls, { shouldValidate: true })
          }
        />
        {errors.images && (
          <p className="mt-1 text-xs text-destructive">{errors.images.message}</p>
        )}
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={isAvailable ?? true}
          onChange={(e) =>
            setValue("isAvailable", e.target.checked, { shouldValidate: true })
          }
          className="size-4 accent-primary"
        />
        <span className="text-sm">Available for rent</span>
      </label>

      <Button type="submit" disabled={isPending} className="w-full cursor-pointer">
        {isPending
          ? mode === "create"
            ? "Creating..."
            : "Saving..."
          : mode === "create"
            ? "Create Gear Listing"
            : "Save Changes"}
      </Button>
    </form>
  )
}
