import { Badge } from "@/components/ui/badge";

const STATUS_STYLES = {
  Preparing: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Delivered: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Cancelled: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  Pending: "bg-sky-500/10 text-sky-700 border-sky-500/20",
};

export default function OrderStatusBadge({ status }) {
  return (
    <Badge className={STATUS_STYLES[status] || "bg-muted text-muted-foreground"}>
      {status}
    </Badge>
  );
}
