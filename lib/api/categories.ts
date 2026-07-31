import { apiClient } from "./client"
import type { ICategory } from "@/lib/types"

export async function fetchCategories(): Promise<ICategory[]> {
  return apiClient("/categories")
}

export async function createCategory(name: string): Promise<ICategory> {
  return apiClient("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export async function updateCategory(
  id: string,
  name: string
): Promise<ICategory> {
  return apiClient(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  })
}

export async function deleteCategory(id: string): Promise<void> {
  return apiClient(`/categories/${id}`, {
    method: "DELETE",
  })
}
