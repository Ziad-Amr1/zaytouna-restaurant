import { NavLink } from "react-router-dom";
import {
  CalendarCheck,
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

export default function AdminSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex min-h-screen w-64 flex-col justify-between border-r border-border bg-card p-5">
      <div>
        <div className="mb-6 flex items-center gap-3 border-b border-border px-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-md shadow-primary/20">
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
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
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
    </aside>
  );
}
