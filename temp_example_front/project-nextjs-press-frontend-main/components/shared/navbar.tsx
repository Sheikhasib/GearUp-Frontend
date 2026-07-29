"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  CreditCardIcon,
  LogInIcon,
  UserPlusIcon,
  LayoutDashboard,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { use, useEffect, useState } from "react";
import { getInitials } from "@/utils";
import { logout } from "@/service/logout";
import { toast } from "sonner";
import { NavbarProps } from "@/lib/types";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "News", href: "/news" },
  { label: "Premium", href: "/premium" },
  { label: "Contact", href: "/contact" },
];

const userMenuItems = [
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "Dashboard", action: "dashboard", icon: LayoutDashboard },
  { label: "Payment", href: "/payment", icon: CreditCardIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
];

// type IUser = {
//   success: boolean;
//   message: string;
//   data: {
//     profile: {
//       id: string;
//       name: string;
//       email: string;
//       activeStatus: string;
//       role: string;
//       createdAt: string;
//       updatedAt: string;
//       profile: {
//         id: string;
//         profilePhoto: string;
//         bio: string | null;
//         userId: string;
//         createdAt: string;
//         updatedAt: string;
//       };
//     };
//   };
// };

// type NavbarProps = {
//   user: IUser;
// };

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  console.log(user.success, "success");

  // use router for navigation after logout to login page
  const router = useRouter();

  // Function to handle user menu actions
  const handleUserMenuAction = async (action: string) => {
    console.log(`User menu action: ${action}`);

    // navigate role wise user to their respective dashboard
    if (action === "dashboard") {
      if (user.data.profile.role === "USER") {
        router.push("/dashboard");
      } else if (user.data.profile.role === "AUTHOR") {
        router.push("/author-dashboard");
      } else if (user.data.profile.role === "ADMIN") {
        router.push("/admin-dashboard");
      }

      return;
    }

    // Add your action logic here
    if (action === "logout") {
      // Handle logout using the logout function from service
      await logout();
      toast.success("User Logged Out Successfully");
      // navigate to login page after logout successfully
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-semibold text-lg tracking-tight text-primary"
        >
          NextJs Prisma
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* User area dropdown */}
        {user.success ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="size-8">
                  <AvatarImage src="/diverse-user-avatars.png" alt="" />
                  <AvatarFallback className="text-primary">
                    {getInitials(user.data?.profile.name || "N/A")}
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
                      {user.data?.profile.name || "N/A"}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user.data?.profile.email || "N/A"}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {/* <DropdownMenuGroup>
                {userMenuItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>
                      <item.icon />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup> */}
              {/* Use "action: dashboard" for role based navigation,
              "href" for navigation to other pages */}
              <DropdownMenuGroup>
                {userMenuItems.map((item) =>
                  item.action ? (
                    <DropdownMenuItem
                      key={item.label}
                      onSelect={() => handleUserMenuAction(item.action)}
                    >
                      <item.icon />
                      {item.label}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href!}>
                        <item.icon />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={async () => {
                    await handleUserMenuAction("logout");
                  }}
                >
                  <LogOutIcon />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/login">
                <LogInIcon className="mr-1" />
                Log In
              </Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                <UserPlusIcon className="mr-1" />
                Sign Up
              </Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
