import { ISidebarItem } from "@/lib/types"
import {
  CreditCard,
  Gauge,
  GearSix,
  Plus,
  Receipt,
  ShieldCheck,
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
]

export const sidebarMenuItems = {
  CUSTOMER: CUSTOMER_SIDEBAR_ITEMS,
  PROVIDER: PROVIDER_SIDEBAR_ITEMS,
  ADMIN: ADMIN_SIDEBAR_ITEMS,
}
