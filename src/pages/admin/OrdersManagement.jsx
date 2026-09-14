import { useCallback, useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { getAllOrders, updateOrderStatus } from "@/api/ordersApi";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime, formatPrice } from "@/lib/format";

const ORDER_STATUSES = ["pending", "preparing", "completed", "cancelled"];

function titleCase(value) {
  return String(value || "").charAt(0).toUpperCase() + String(value).slice(1);
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllOrders();
      const list = (response.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(list);
    } catch {
      setError("We couldn't load orders right now. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [load]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const response = await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? response.data : o)));
      toast.success(`Order ${id} marked as ${status}.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update the order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    { header: "Order ID", accessor: "id" },
    { header: "Customer ID", accessor: "userId" },
    {
      header: "Items",
      accessor: "items",
      render: (row) =>
        (row.items || []).map((item) => `${item.quantity} × ${item.name}`).join(", "),
    },
    {
      header: "Total Amount",
      accessor: "total",
      render: (row) => formatPrice(row.total),
    },
    {
      header: "Date & Time",
      accessor: "createdAt",
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <Select
          value={row.status}
          onValueChange={(value) => handleStatusChange(row.id, value)}
          disabled={updatingId === row.id}
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
                {titleCase(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Orders Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Track live customer orders, update prep status, and review receipts.
          </p>
        </div>
        {error ? (
          <Button variant="outline" onClick={() => void load()}>
            <RefreshCcw className="mr-2 size-4" aria-hidden="true" /> Retry
          </Button>
        ) : null}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="mt-3 h-5 w-full" />
          <Skeleton className="mt-3 h-5 w-3/4" />
        </div>
      ) : error ? (
        <EmptyState
          title="Something went wrong"
          description={error}
          action={
            <Button variant="outline" onClick={() => void load()}>
              Try again
            </Button>
          }
        />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Orders placed by customers will appear here."
        />
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          emptyMessage="No customer orders found yet."
        />
      )}
    </div>
  );
}