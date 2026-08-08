import type { Metadata } from "next"
import { fetchCategories } from "@/lib/api/categories"
import { fetchGear } from "@/lib/api/gear"
import { CategoryGrid } from "@/components/sections/category-grid"
import type { ICategory } from "@/lib/types"

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse every gear category at GearUp.",
}

export default async function CategoriesPage() {
  const categories = await fetchCategories().catch(() => [] as ICategory[])

  const categoryCounts = await Promise.all(
    categories.map(async (category) => {
      try {
        const { meta } = await fetchGear({ categoryId: category.id, limit: 1 })
        return { category, count: meta?.total ?? 0 }
      } catch {
        return { category, count: 0 }
      }
    })
  )

  return (
    <>
      <CategoryGrid categories={categoryCounts} />
      <div className="pb-16" />
    </>
  )
}