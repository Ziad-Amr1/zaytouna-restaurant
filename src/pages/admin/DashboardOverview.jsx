import { useState } from "react";
import StatCard from "@/components/common/StatCard";
import DataTable from "@/components/common/DataTable";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import { DollarSign, ShoppingBag, Calendar, Users } from "lucide-react";

export default function DashboardOverview() {
  const [orders] = useState([]);
  const [stats] = useState({
    dailyRevenue: "$0.00",
    todayOrders: 0,
    tableBookings: 0,
    activeCustomers: 0,
  });

  const columns = [
    { header: "Order ID", accessor: "id" },
    { header: "Customer", accessor: "customer" },
    { header: "Dishes Ordered", accessor: "items" },
    { header: "Total", accessor: "total" },
    { header: "Time", accessor: "time" },
    { 
      header: "Status", 
      accessor: "status", 
      render: (row) => <OrderStatusBadge status={row.status} /> 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Restaurant Overview</h2>
        <p className="text-sm text-muted-foreground">Live operational stats for Zaytouna Restaurant.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Daily Revenue" value={stats.dailyRevenue} icon={DollarSign} />
        <StatCard title="Today's Orders" value={stats.todayOrders} icon={ShoppingBag} />
        <StatCard title="Table Bookings" value={stats.tableBookings} icon={Calendar} />
        <StatCard title="Active Customers" value={stats.activeCustomers} icon={Users} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Recent Customer Orders</h3>
        <DataTable 
          columns={columns} 
          data={orders} 
          emptyMessage="No recent customer orders recorded yet."
        />
      </div>
    </div>
  );
}