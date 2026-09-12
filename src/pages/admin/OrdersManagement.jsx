import { useState } from "react";
import DataTable from "@/components/common/DataTable";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";

export default function OrdersManagement() {
  // Empty state placeholder ready for API integration
  const [orders, setOrders] = useState([]);

  // Handler to update an order's status locally
  const updateOrderStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // Table column configuration
  const columns = [
    { header: "Order ID", accessor: "id" },
    { header: "Customer", accessor: "customer" },
    { header: "Items", accessor: "items" },
    { header: "Total Amount", accessor: "total" },
    { header: "Date & Time", accessor: "time" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <OrderStatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => updateOrderStatus(row.id, e.target.value)}
          className="rounded-lg border border-border bg-card px-2 py-1 text-xs font-medium text-foreground outline-none"
        >
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Orders Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Track live customer orders, update prep status, and review receipts.
        </p>
      </div>

      {/* Render orders table with default empty state */}
      <DataTable
        columns={columns}
        data={orders}
        emptyMessage="No customer orders found yet."
      />
    </div>
  );
}