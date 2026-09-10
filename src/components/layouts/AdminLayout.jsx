import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Bell, Search } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
          <div className="flex w-96 items-center gap-3 rounded-xl border border-border bg-muted/40 px-3.5 py-2">
            <Search size={18} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search dishes, orders, guests..." 
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-card"></span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}