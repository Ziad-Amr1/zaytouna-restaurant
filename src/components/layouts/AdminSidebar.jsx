import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  CalendarCheck, 
  Users, 
  TrendingUp, 
  LogOut,
  ShieldCheck
} from "lucide-react";
import useAuth from "@/hooks/useAuth";

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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 font-bold text-white shadow-md shadow-emerald-700/20">
            Z
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">Zaytouna</h1>
            <p className="text-xs font-medium text-emerald-700">Levantine & Grill</p>
          </div>
        </div>

        <nav className="space-y-1.5">
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
                      ? "bg-emerald-700 text-white shadow-sm shadow-emerald-700/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="truncate text-xs font-semibold text-foreground">{user?.name || "Admin"}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
              <ShieldCheck size={12} /> {user?.role || "admin"}
            </span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/20"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}