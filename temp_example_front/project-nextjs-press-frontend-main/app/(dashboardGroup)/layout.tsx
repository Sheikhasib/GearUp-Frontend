import { Navbar } from "@/components/shared/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getMe } from "@/service/getMe";
import type { ReactNode } from "react";
import DashboardSidebar from "./_components/DashboardSidebar";

const Dashboardlayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <SidebarProvider>
        <DashboardSidebar user={user}></DashboardSidebar>
        <main className="flex-1 min-w-0">{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default Dashboardlayout;
