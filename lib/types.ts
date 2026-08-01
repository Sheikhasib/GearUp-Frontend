import type { Icon } from "@phosphor-icons/react"

export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN"
export type UserStatus = "ACTIVE" | "SUSPENDED"
export type RentalStatus = "PLACED" | "CONFIRMED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED"
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED"

export interface IUser {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  status: UserStatus
  createdAt?: string
}

export interface ICategory {
  id: string
  name: string
  slug: string
}

export interface IGearItem {
  id: string
  providerId: string
  categoryId: string
  name: string
  description: string
  brand?: string
  priceRatePerDay: number
  quantity: number
  availableQuantity: number
  images: string[]
  isAvailable: boolean
  createdAt: string
  updatedAt: string
  category?: Pick<ICategory, "id" | "name">
  provider?: Pick<IUser, "id" | "name" | "email">
  reviews?: IReview[]
  unavailableRanges?: { startDate: string; endDate: string }[]
}

export interface ICreateGearPayload {
  name: string
  description: string
  brand?: string
  categoryId: string
  priceRatePerDay: number
  quantity: number
  images?: string[]
  isAvailable?: boolean
}

export type IUpdateGearPayload = Partial<ICreateGearPayload>

export interface IRentalOrder {
  id: string
  customerId: string
  gearItemId: string
  startDate: string
  endDate: string
  quantity: number
  totalPrice: number
  status: RentalStatus
  createdAt: string
  updatedAt: string
  gearItem?: IGearItem
  customer?: IUser
  payments?: {
    id?: string
    status: PaymentStatus
    tranId?: string
    amount?: number
    method?: string
    paidAt?: string
  }[]
  review?: IReview | null
}

export interface ICreateRentalPayload {
  gearItemId: string
  startDate: string
  endDate: string
  quantity: number
}

export interface IPayment {
  id: string
  tranId: string
  orderId: string
  amount: number
  status: PaymentStatus
  method?: string
  paidAt?: string
}

export interface IReview {
  id: string
  customerId: string
  gearItemId: string
  rentalOrderId: string
  rating: number
  comment?: string
  createdAt: string
  customer?: Pick<IUser, "id" | "name">
}

export interface IApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface IGearQuery {
  searchTerm?: string
  categoryId?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  availableFrom?: string
  availableTo?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export type ISidebarItem = {
  label: string
  href: string
  icon: Icon
}
