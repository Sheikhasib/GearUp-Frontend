import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getMe } from "@/service/getMe"
import type { ReactNode } from "react"
import { DashboardSidebar } from "./_components/DashboardSidebar"

const Dashboardlayout = async ({ children }: { children: ReactNode }) => {
  const user = await getMe()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <SidebarProvider>
        <DashboardSidebar user={user} />
        <main className="flex-1 min-w-0">
          <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-2 md:hidden">
            <SidebarTrigger />
            <span className="font-heading text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Menu
            </span>
          </div>
          {children}
        </main>
      </SidebarProvider>
      <Footer />
    </div>
  )
}

export default Dashboardlayout
