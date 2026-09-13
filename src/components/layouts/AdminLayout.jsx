import { Outlet } from "react-router-dom";
import { Bell, Search } from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
          <div className="flex w-96 items-center gap-3 rounded-xl border border-border bg-muted/40 px-3.5 py-2">
            <Search size={18} className="text-muted-foreground" aria-hidden="true" />
            <Input
              id="admin-global-search"
              type="text"
              aria-label="Search dishes, orders, guests"
              placeholder="Search dishes, orders, guests..."
              className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative rounded-xl text-muted-foreground hover:bg-muted"
            >
              <Bell size={20} aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-card"
              />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
