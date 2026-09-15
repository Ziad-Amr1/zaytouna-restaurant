import { Outlet } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import AdminNav from "./AdminNav";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Was a separate AdminSidebar.jsx that did nothing but wrap this. */}
      <aside className="hidden w-64 shrink-0 border-e border-border bg-card p-3 md:block">
        <AdminNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />

        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}