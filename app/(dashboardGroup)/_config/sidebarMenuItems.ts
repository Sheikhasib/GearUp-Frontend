import { ISidebarItem } from "@/lib/types"
import {
  CreditCard,
  FolderSimple,
  Gauge,
  GearSix,
  Plus,
  Receipt,
  ShieldCheck,
  Truck,
} from "@phosphor-icons/react"

const CUSTOMER_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Dashboard",
    href: "/customer-dashboard",
    icon: Gauge,
  },
  {
    label: "My Orders",
    href: "/customer-dashboard/orders",
    icon: Receipt,
  },
  {
    label: "Payments",
    href: "/customer-dashboard/payments",
    icon: CreditCard,
  },
]

const PROVIDER_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Dashboard",
    href: "/provider-dashboard",
    icon: Gauge,
  },
  {
    label: "My Gear",
    href: "/provider-dashboard/my-gear",
    icon: GearSix,
  },
  {
    label: "Orders",
    href: "/provider-dashboard/orders",
    icon: Truck,
  },
  {
    label: "Add Gear",
    href: "/provider-dashboard/gear/new",
    icon: Plus,
  },
]

const ADMIN_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Dashboard",
    href: "/admin-dashboard",
    icon: ShieldCheck,
  },
  {
    label: "Users",
    href: "/admin-dashboard/users",
    icon: CreditCard,
  },
  {
    label: "Gear",
    href: "/admin-dashboard/gear",
    icon: GearSix,
  },
  {
    label: "Orders",
    href: "/admin-dashboard/orders",
    icon: Truck,
  },
  {
    label: "Categories",
    href: "/admin-dashboard/categories",
    icon: FolderSimple,
  },
]

export const sidebarMenuItems = {
  CUSTOMER: CUSTOMER_SIDEBAR_ITEMS,
  PROVIDER: PROVIDER_SIDEBAR_ITEMS,
  ADMIN: ADMIN_SIDEBAR_ITEMS,
}
