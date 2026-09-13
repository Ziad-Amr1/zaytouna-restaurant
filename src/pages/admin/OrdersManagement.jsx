import { useState } from "react";

import DataTable from "@/components/common/DataTable";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ORDER_STATUSES = ["Pending", "Preparing", "Completed", "Cancelled"];

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
        <Select
          value={row.status}
          onValueChange={(value) => updateOrderStatus(row.id, value)}
        >
          <SelectTrigger
            size="sm"
            aria-label={`Update status for order ${row.id}`}
            className="rounded-lg px-2 text-xs font-medium"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <DataTable
        columns={columns}
        data={orders}
        emptyMessage="No customer orders found yet."
      />
    </div>
  );
}
