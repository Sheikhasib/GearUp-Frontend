"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bicycle,
  SignOut,
  User,
  Gauge,
  CreditCard,
  GearSix,
  Sun,
  Moon,
} from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { getInitials } from "@/utils"
import { logout } from "@/service/logout"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { useEffect } from "react"
import type { IUser } from "@/lib/types"

interface NavbarProps {
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

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Browse Gear", href: "/gears" },
  { label: "Contact", href: "/contact" },
]

const userMenuItems = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Dashboard", action: "dashboard", icon: Gauge },
  { label: "Payment", href: "/payment", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: GearSix },
]

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { setUser, clear } = useAuthStore()

  useEffect(() => {
    if (user?.success) {
      setUser(user.data)
    } else {
      clear()
    }
  }, [user, setUser, clear])

  const handleUserMenuAction = async (action: string) => {
    if (action === "dashboard") {
      if (!user?.success) return
      const role = user.data.role
      if (role === "CUSTOMER") router.push("/customer-dashboard")
      else if (role === "PROVIDER") router.push("/provider-dashboard")
      else if (role === "ADMIN") router.push("/admin-dashboard")
      return
    }

    if (action === "logout") {
      await logout()
      clear()
      toast.success("Logged out successfully")
      router.push("/login")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-primary"
        >
          <Bicycle />
          GearUp
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun /> : <Moon />}
          </Button>

        {user?.success ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs text-primary">
                    {getInitials(user.data.name || "N/A")}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">
                      {user.data.name || "N/A"}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground lowercase">
                      {user.data.email || "N/A"}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {userMenuItems.map((item) =>
                  item.action ? (
                    <DropdownMenuItem
                      key={item.label}
                      className="gap-2"
                      onSelect={() => handleUserMenuAction(item.action!)}
                    >
                      <item.icon />
                      {item.label}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem key={item.href} className="gap-2" asChild>
                      <Link href={item.href!}>
                        <item.icon />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  className="gap-2"
                  onSelect={() => handleUserMenuAction("logout")}
                >
                  <SignOut />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        )}
        </div>
      </nav>
    </header>
  )
}
