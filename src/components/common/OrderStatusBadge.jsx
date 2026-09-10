export default function OrderStatusBadge({ status }) {
  const styles = {
    Preparing: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    Delivered: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
    Pending: 'bg-sky-500/10 text-sky-700 border-sky-500/20',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] || 'bg-muted text-muted-foreground'}`}>
      {status}
    </span>
  );
}