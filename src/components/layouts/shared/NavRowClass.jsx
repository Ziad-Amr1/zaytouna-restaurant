import { cn } from "@/lib/utils";

/**
 * One class function for every icon+label nav row (mobile sheet and admin
 * sidebar used two near-identical copies). min-h-11 keeps the touch target
 * at 44px on phones.
 */
export function navRowClass({ isActive }) {
  return cn(
    "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5",
    "text-sm font-medium transition-colors",
    isActive
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}
