import {
  CalendarDays,
  ClipboardList,
  Heart,
  House,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";

import { cn } from "@/lib/utils";

export function getPublicLinks(t) {
  return [
    {
      to: "/",
      label: t("nav.home"),
      icon: House,
    },
    {
      to: "/menu",
      label: t("nav.menu"),
      icon: UtensilsCrossed,
    },
  ];
}

export function getUserLinks(t) {
  return [
    {
      to: "/favorites",
      label: t("nav.favorites"),
      icon: Heart,
    },
    {
      to: "/orders",
      label: t("nav.orders"),
      icon: ClipboardList,
    },
    {
      to: "/reservations",
      label: t("nav.reservations"),
      icon: CalendarDays,
    },
  ];
}

export function getDesktopLinkClass({ isActive }) {
  return cn(
    "text-sm font-medium transition-colors hover:text-foreground",
    isActive ? "text-foreground" : "text-muted-foreground",
  );
}

export function getMobileLinkClass({ isActive }) {
  return cn(
    "flex items-center gap-3 rounded-xl px-3 py-3",
    "text-sm font-medium transition-colors",
    "hover:bg-accent",
    isActive ? "bg-accent text-accent-foreground" : "text-foreground",
  );
}

export function getAdminLink(t) {
  return {
    to: "/admin",
    label: t("nav.admin"),
    icon: ShieldCheck,
  };
}
