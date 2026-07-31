import type { IApiResponse } from "@/lib/types"

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
    ...options,
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.message || "Something went wrong")
  }

  return json.data
}

export async function apiClientFull<T>(
  endpoint: string,
  options?: RequestInit
): Promise<IApiResponse<T>> {
  const res = await fetch(`${API_BASE}/api${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
    ...options,
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.message || "Something went wrong")
  }

  return json as IApiResponse<T>
}
