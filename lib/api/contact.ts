import { apiClient, apiClientFull } from "./client"
import type {
  IApiResponse,
  IContactMessage,
  IContactPayload,
} from "@/lib/types"

export async function createContactMessage(
  payload: IContactPayload
): Promise<IContactMessage> {
  return apiClient("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export interface IContactListResult {
  data: IContactMessage[]
  meta?: IApiResponse<IContactMessage[]>["meta"]
}

export async function fetchContactMessages(
  page?: number,
  limit?: number,
  searchTerm?: string
): Promise<IContactListResult> {
  const params = new URLSearchParams()
  if (page) params.set("page", String(page))
  if (limit) params.set("limit", String(limit))
  if (searchTerm) params.set("searchTerm", searchTerm)

  const qs = params.toString()
  const res = await apiClientFull<IContactMessage[]>(
    `/admin/contact-messages${qs ? `?${qs}` : ""}`
  )
  return { data: res.data, meta: res.meta }
}
