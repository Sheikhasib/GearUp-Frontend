"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchContactMessages } from "@/lib/api/contact"

export function useContactMessages(page: number, searchTerm?: string) {
  return useQuery({
    queryKey: ["contact-messages", page, searchTerm ?? ""],
    queryFn: () => fetchContactMessages(page, 10, searchTerm),
  })
}
