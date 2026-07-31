"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ISidebarItem, IUser } from "@/lib/types"
import { Bicycle, SignOut } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { sidebarMenuItems } from "../_config/sidebarMenuItems"
import { getInitials } from "@/utils"
import { logout } from "@/service/logout"
import { toast } from "sonner"

interface DashboardSidebarProps {
  user:
    | {
        success: true
        data: IUser
        message: string
      }
    | {
        success: false
        message: string
      }
    | null
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  let navItems: ISidebarItem[] = []

  if (user?.success) {
    navItems = sidebarMenuItems[user.data.role]
  }

  const matchingItems = navItems.filter(
    (item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`)
  )
  const activeHref =
    matchingItems.length > 0
      ? matchingItems.reduce((longest, item) =>
          item.href.length > longest.href.length ? item : longest
        ).href
      : null

  const handleLogout = async () => {
    await logout()
    toast.success("User Logged out successfully")
    router.push("/login")
  }

  return (
    <Sidebar
      collapsible="none"
      className="h-[calc(100svh-3.5rem)] border-r border-sidebar-border"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Bicycle />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-sm font-semibold tracking-widest uppercase">
              GearUp
            </span>
            <span className="text-xs text-sidebar-foreground/70">
              {user?.success ? `${user.data.name} • ${user.data.role}` : "Dashboard"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.href === activeHref}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        {user?.success ? (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="text-xs text-primary">
                {getInitials(user.data.name || "N/A")}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-sm font-medium">
                {user.data.name || "N/A"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.data.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <SignOut />
            </Button>
          </div>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  )
}
