import { useQuery } from "@tanstack/react-query"
import { fetchMyPayments } from "@/lib/api/payments"

export function useCustomerPayments() {
  return useQuery({
    queryKey: ["customer-payments"],
    queryFn: fetchMyPayments,
  })
}
