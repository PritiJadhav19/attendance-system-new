
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "./Header";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
