import { NavLink } from "react-router-dom";
import {
  CalendarCheck,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/menu", label: "Menu Management", icon: UtensilsCrossed },
  { path: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { path: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
  { path: "/admin/users", label: "Users & Roles", icon: Users },
  { path: "/admin/analytics", label: "Analytics", icon: TrendingUp },
];

export function SidebarContent({ onNavigate = () => {}, compact = false }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className={`flex items-center border-b border-border px-3 ${compact ? "mb-3 gap-2.5 py-3" : "mb-6 gap-3 py-4"}`}>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-md shadow-primary/20 ${compact ? "h-9 w-9 text-sm" : ""}`}>
            Z
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">Zaytouna</h1>
            <p className="text-xs font-medium text-muted-foreground">Levantine &amp; Grill</p>
          </div>
        </div>

        <nav aria-label="Admin" className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 text-sm font-medium transition-all ${compact ? "gap-2.5 py-2" : "gap-3 py-3"} ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon size={compact ? 14 : 18} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <NavLink
          to="/"
          onClick={onNavigate}
          aria-label="Back to the public website"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink size={compact ? 14 : 16} aria-hidden="true" />
          <span>Back to Website</span>
        </NavLink>

        <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-xs font-semibold text-foreground">{user?.name || "Admin"}</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <ShieldCheck size={12} aria-hidden="true" /> {user?.role || "admin"}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={logout}
          className="w-full rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={16} aria-hidden="true" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
      <SidebarContent />
    </aside>
  );
}
