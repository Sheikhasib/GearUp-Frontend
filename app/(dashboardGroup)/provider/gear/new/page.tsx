"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GearImageUpload } from "@/components/shared/gear-image-upload"
import { useCategories } from "@/hooks/useCategories"
import { useCreateGear } from "@/hooks/useProvider"
import type { ICreateGearPayload } from "@/lib/types"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function AddGearPage() {
  const router = useRouter()
  const { data: categories } = useCategories()
  const { mutate: createGear, isPending } = useCreateGear()

  const [form, setForm] = useState<ICreateGearPayload>({
    name: "",
    description: "",
    brand: "",
    categoryId: "",
    priceRatePerDay: 0,
    quantity: 1,
    images: [],
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ICreateGearPayload, string>>>({})

  const validate = () => {
    const errs: typeof errors = {}
    if (!form.name.trim()) errs.name = "Name is required"
    if (!form.description.trim()) errs.description = "Description is required"
    if (!form.categoryId) errs.categoryId = "Category is required"
    if (form.priceRatePerDay <= 0) errs.priceRatePerDay = "Price must be greater than 0"
    if (form.quantity < 1) errs.quantity = "Quantity must be at least 1"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    createGear(form, {
      onSuccess: () => {
        router.push("/dashboard/provider")
      },
    })
  }

  const update = <K extends keyof ICreateGearPayload>(key: K, value: ICreateGearPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-bold">Add New Gear</h1>
          <p className="text-sm text-muted-foreground">List a new item for rent</p>
        </motion.div>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Mountain Bike Pro"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Describe the gear, condition, what's included..."
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand" className="mb-1.5 block text-sm font-medium">
                Brand
              </label>
              <input
                id="brand"
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Trek, Coleman"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                value={form.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="mb-1.5 block text-sm font-medium">
                Price per day ($)
              </label>
              <input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={form.priceRatePerDay}
                onChange={(e) => update("priceRatePerDay", Number(e.target.value))}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.priceRatePerDay && <p className="mt-1 text-xs text-red-500">{errors.priceRatePerDay}</p>}
            </div>

            <div>
              <label htmlFor="quantity" className="mb-1.5 block text-sm font-medium">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => update("quantity", Number(e.target.value))}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Images</label>
            <GearImageUpload images={form.images || []} onImagesChange={(images) => update("images", images)} />
          </div>

          <motion.button
            type="submit"
            disabled={isPending}
            whileTap={{ scale: 0.97 }}
            className="w-full cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Gear Listing"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}
