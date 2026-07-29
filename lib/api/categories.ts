import { apiClient } from "./client"
import type { ICategory } from "@/lib/types"

export async function fetchCategories(): Promise<ICategory[]> {
  return apiClient("/categories")
}
