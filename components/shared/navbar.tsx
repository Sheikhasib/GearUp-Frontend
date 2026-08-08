"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Bicycle,
  SignIn,
  SignOut,
  User,
  UserPlus,
  Gauge,
  Sun,
  Moon,
  List,
  X,
} from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { getInitials } from "@/utils"
import { logout } from "@/service/logout"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { useEffect, useState } from "react"
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
  { label: "Browse Gear", href: "/gears" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
]

const dashboardHref: Record<IUser["role"], string> = {
  CUSTOMER: "/customer-dashboard",
  PROVIDER: "/provider-dashboard",
  ADMIN: "/admin-dashboard",
}

const userMenuItems = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Dashboard", action: "dashboard", icon: Gauge },
]

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { setUser, clear } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLoggedIn = user?.success

  const navItemsWithDashboard = isLoggedIn
    ? [...navItems, { label: "Dashboard", href: dashboardHref[user!.data.role] }]
    : navItems

  // Set the user in the auth store
  useEffect(() => {
    if (user?.success) {
      setUser(user.data)
    } else {
      clear()
    }
  }, [user, setUser, clear])

  // Function to handle user menu actions
  const handleUserMenuAction = async (action: string) => {
    if (action === "dashboard") {
      if (!user?.success) return
      router.push(dashboardHref[user.data.role])
      return
    }

    // Logout action
    if (action === "logout") {
      try {
        await logout()
        toast.success("User Logged out successfully")
      } catch {
        toast.error("Failed to log out. Please try again.")
      }
      clear() // clear the auth store
      setMobileOpen(false)
      router.push("/login") // redirect to login page
    }
  }

  const handleLogout = () => handleUserMenuAction("logout")

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
          {navItemsWithDashboard.map((item) => (
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

          <div className="hidden md:block">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="size-8">
                      {user!.data.avatarUrl ? (
                        <AvatarImage
                          src={user!.data.avatarUrl}
                          alt={user!.data.name || "Avatar"}
                        />
                      ) : (
                        <AvatarFallback className="text-xs text-primary">
                          {getInitials(user!.data.name || "N/A")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">
                          {user!.data.name || "N/A"}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground lowercase">
                          {user!.data.email || "N/A"}
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
                        <DropdownMenuItem
                          key={item.href}
                          className="gap-2"
                          asChild
                        >
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
                      onSelect={handleLogout}
                    >
                      <SignOut />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button size="sm" asChild>
                  <Link href="/login">
                    <SignIn className="mr-1" />
                    Log In
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">
                    <UserPlus className="mr-1" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <List />
          </Button>
        </div>
      </nav>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-72 bg-background p-0 sm:max-w-xs"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Primary navigation menu
          </SheetDescription>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-lg font-semibold tracking-tight text-primary"
              >
                <Bicycle />
                GearUp
              </Link>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="flex flex-col gap-1">
                {navItemsWithDashboard.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:text-primary",
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
            </nav>

            <div className="border-t border-border p-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Avatar className="size-9">
                    {user!.data.avatarUrl ? (
                      <AvatarImage
                        src={user!.data.avatarUrl}
                        alt={user!.data.name || "Avatar"}
                      />
                    ) : (
                      <AvatarFallback className="text-xs text-primary">
                        {getInitials(user!.data.name || "N/A")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-sm font-medium">
                      {user!.data.name || "N/A"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user!.data.email}
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
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/login">
                      <SignIn className="mr-1" />
                      Log In
                    </Link>
                  </Button>
                  <Button variant="outline" asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/register">
                      <UserPlus className="mr-1" />
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
