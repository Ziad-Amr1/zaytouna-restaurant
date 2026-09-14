import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONES = {
  pending: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  preparing: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

function capitalize(value) {
  if (!value) return value;
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

export default function StatusBadge({ status, className }) {
  const key = String(status ?? "").toLowerCase();
  return (
    <Badge
      className={cn(TONES[key] || "border-border bg-muted text-muted-foreground", className)}
    >
      {capitalize(status)}
    </Badge>
  );
}