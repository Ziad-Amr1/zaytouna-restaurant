import { useState } from "react";
import { Outlet } from "react-router-dom";

import safeStorage from "@/lib/storage";
import { cn } from "@/lib/utils";

import AdminHeader from "./AdminHeader";
import AdminNav from "./AdminNav";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(
    () => safeStorage.get("admin_sidebar_collapsed") === "true"
  );

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      safeStorage.set("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sleek Fixed Sidebar */}
      <aside
        className={cn(
          "fixed start-0 top-0 z-30 hidden h-screen border-e border-border bg-card text-foreground transition-all duration-300 ease-out md:flex md:flex-col",
          isCollapsed ? "w-20" : "w-64 lg:w-72"
        )}
      >
        <AdminNav isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
      </aside>

      {/* Main Content Area with padding offset corresponding to sidebar width */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-all duration-300 ease-out",
          isCollapsed ? "md:ps-20" : "md:ps-64 lg:ps-72"
        )}
      >
        <AdminHeader />

        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}