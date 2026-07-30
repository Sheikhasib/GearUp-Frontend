import { GearsContent } from "../_components/gear/GearsContent"
import type { IGearItem } from "@/lib/types"

const API_URL = process.env.BACKEND_API_URL || "http://localhost:4000"

async function getGears(params: Record<string, string>): Promise<IGearItem[]> {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set("searchTerm", params.search)
  if (params.categoryId) searchParams.set("categoryId", params.categoryId)
  if (params.minPrice) searchParams.set("minPrice", params.minPrice)
  if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice)
  if (params.availableFrom) searchParams.set("availableFrom", params.availableFrom)
  if (params.availableTo) searchParams.set("availableTo", params.availableTo)
  searchParams.set("limit", "12")

  try {
    const res = await fetch(`${API_URL}/api/gear?${searchParams.toString()}`, {
      cache: "no-cache",
    })
    const json = await res.json()
    return json.data ?? []
  } catch {
    return []
  }
}

export default async function GearsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const initialParams: Record<string, string> = {}
  if (typeof sp.search === "string") initialParams.search = sp.search
  if (typeof sp.categoryId === "string") initialParams.categoryId = sp.categoryId
  if (typeof sp.minPrice === "string") initialParams.minPrice = sp.minPrice
  if (typeof sp.maxPrice === "string") initialParams.maxPrice = sp.maxPrice
  if (typeof sp.availableFrom === "string") initialParams.availableFrom = sp.availableFrom
  if (typeof sp.availableTo === "string") initialParams.availableTo = sp.availableTo

  const initialData = await getGears(initialParams)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight">Browse Gear</h1>
        <p className="mt-2 text-muted-foreground">
          Find the perfect gear for your next adventure
        </p>
      </div>
      <GearsContent initialData={initialData} initialParams={initialParams} />
    </div>
  )
}
