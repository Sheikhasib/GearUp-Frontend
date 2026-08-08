import type { IApiResponse } from "@/lib/types"

const API_BASE =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"
    : ""

const ACCESS_TOKEN_COOKIE = "accessTokenClient"

function getAccessToken(): string | undefined {
  if (typeof document === "undefined") return undefined
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${ACCESS_TOKEN_COOKIE}=([^;]*)`)
  )
  return match ? decodeURIComponent(match[1]) : undefined
}

function buildHeaders(options?: RequestInit): HeadersInit {
  const token = getAccessToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  }
}

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
    ...options,
    headers: buildHeaders(options),
    credentials: "include",
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
    ...options,
    headers: buildHeaders(options),
    credentials: "include",
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.message || "Something went wrong")
  }

  return json as IApiResponse<T>
}
