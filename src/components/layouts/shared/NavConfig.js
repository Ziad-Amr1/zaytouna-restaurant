import {
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  Heart,
  House,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from "lucide-react";

/**
 * Plain data, no `t` needed. Components call t(item.labelKey) themselves,
 * so these stay constants instead of functions rebuilt on every render.
 */

export const PUBLIC_NAV = [
  { to: "/", labelKey: "nav.home", icon: House, end: true },
  { to: "/menu", labelKey: "nav.menu", icon: UtensilsCrossed },
];

export const USER_NAV = [
  { to: "/favorites", labelKey: "nav.favorites", icon: Heart },
  { to: "/orders", labelKey: "nav.orders", icon: ClipboardList },
  { to: "/reservations", labelKey: "nav.reservations", icon: CalendarDays },
];

export const ADMIN_LINK = {
  to: "/admin",
  labelKey: "nav.admin",
  icon: ShieldCheck,
};

export const FOOTER_NAV = [
  ...PUBLIC_NAV,
  { to: "/cart", labelKey: "nav.cart" },
];

export const ADMIN_NAV = [
  {
    to: "/admin",
    labelKey: "admin.nav.dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/menu",
    labelKey: "admin.nav.menuManagement",
    icon: UtensilsCrossed,
  },
  { to: "/admin/orders", labelKey: "admin.nav.orders", icon: ShoppingBag },
  {
    to: "/admin/reservations",
    labelKey: "admin.nav.reservations",
    icon: CalendarCheck,
  },
  { to: "/admin/users", labelKey: "admin.nav.usersRoles", icon: Users },
  { to: "/admin/analytics", labelKey: "admin.nav.analytics", icon: TrendingUp },
];

export function getNavLinks(isAuthenticated, userRole) {
  return [
    ...PUBLIC_NAV,
    ...(isAuthenticated ? USER_NAV : []),
    ...(userRole === "admin" ? [ADMIN_LINK] : []),
  ];
}

