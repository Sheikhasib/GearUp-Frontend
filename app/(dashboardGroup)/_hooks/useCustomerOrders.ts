import { useQuery } from "@tanstack/react-query"
import { fetchMyRentals } from "@/lib/api/rentals"

export function useCustomerOrders() {
  return useQuery({
    queryKey: ["customer-orders"],
    queryFn: fetchMyRentals,
  })
}
