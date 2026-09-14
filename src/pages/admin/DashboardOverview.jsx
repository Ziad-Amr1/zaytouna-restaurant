import { useEffect, useState } from "react";
import { Calendar, DollarSign, RefreshCcw, ShoppingBag, Users } from "lucide-react";

import { getAllOrders } from "@/api/ordersApi";
import { getAllReservations } from "@/api/reservationsApi";
import DataTable from "@/components/common/DataTable";
import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime, formatPrice } from "@/lib/format";
import { computeDashboardStats } from "@/lib/statistics";

function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersRes, reservationsRes] = await Promise.all([
        getAllOrders(),
        getAllReservations(),
      ]);
      const orderList = ordersRes.data || [];
      setOrders(orderList);
      setStats(computeDashboardStats(orderList, reservationsRes.data || []));
    } catch {
      setError("We couldn't load the dashboard right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const columns = [
    { header: "Order ID", accessor: "id" },
    { header: "Customer ID", accessor: "userId" },
    {
      header: "Dishes Ordered",
      accessor: "items",
      render: (row) => {
        const count = (row.items || []).reduce((sum, item) => sum + item.quantity, 0);
        return `${count} item${count === 1 ? "" : "s"}`;
      },
    },
    {
      header: "Total",
      accessor: "total",
      render: (row) => formatPrice(row.total),
    },
    {
      header: "Time",
      accessor: "createdAt",
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Restaurant Overview</h2>
          <p className="text-sm text-muted-foreground">Live operational stats for Zaytouna Restaurant.</p>
        </div>
        {error ? (
          <Button variant="outline" onClick={() => void load()}>
            <RefreshCcw className="mr-2 size-4" aria-hidden="true" /> Retry
          </Button>
        ) : null}
      </div>

      {loading ? (
        <SkeletonStats />
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-8 text-center text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Daily Revenue" value={formatPrice(stats.dailyRevenue)} icon={DollarSign} />
          <StatCard title="Today's Orders" value={stats.todayOrders} icon={ShoppingBag} />
          <StatCard title="Table Bookings" value={stats.tableBookings} icon={Calendar} />
          <StatCard title="Active Customers" value={stats.activeCustomers} icon={Users} />
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Recent Customer Orders</h3>
        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-6">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="mt-3 h-5 w-full" />
            <Skeleton className="mt-3 h-5 w-2/3" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={recentOrders}
            emptyMessage="No recent customer orders recorded yet."
          />
        )}
      </div>
    </div>
  );
}