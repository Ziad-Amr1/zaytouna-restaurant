import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getAllOrders, updateOrderStatus } from "@/api/ordersApi";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchData from "@/hooks/useFetchData";
import { formatDateTime, formatPrice } from "@/lib/format";

const ORDER_STATUSES = ["pending", "preparing", "completed", "cancelled"];

function titleCase(value) {
  return String(value || "").charAt(0).toUpperCase() + String(value).slice(1);
}

export default function OrdersManagement() {
  const { t } = useTranslation();
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    const res = await getAllOrders();
    return (res.data || []).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, []);

  const { data: orders, setData: setOrders, loading, error, refetch } = useFetchData(
    fetchOrders,
    [],
    []
  );

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      const response = await updateOrderStatus(id, status);
      setOrders((prev) => (prev || []).map((o) => (o.id === id ? response.data : o)));
      toast.success(`Order ${id} marked as ${status}.`);
    } catch (err) {
      toast.error(err.response?.data?.message || t("cart.orderFailed"));
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    { header: t("admin.table.orderId"), accessor: "id" },
    { header: t("admin.table.customerId"), accessor: "userId" },
    {
      header: t("admin.table.dishesOrdered"),
      accessor: "items",
      render: (row) =>
        (row.items || []).map((item) => `${item.quantity} × ${item.name}`).join(", "),
    },
    {
      header: t("admin.table.total"),
      accessor: "total",
      render: (row) => formatPrice(row.total),
    },
    {
      header: t("admin.table.time"),
      accessor: "createdAt",
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      header: t("admin.table.status"),
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: t("admin.navigationLabel"),
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
      <PageHeader
        title={t("admin.nav.orders")}
        description="Track live customer orders, update prep status, and review receipts."
        onRefresh={error ? refetch : undefined}
      />

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="mt-3 h-5 w-full" />
          <Skeleton className="mt-3 h-5 w-3/4" />
        </div>
      ) : error ? (
        <EmptyState
          title={t("common.somethingWentWrong")}
          description={error}
          action={
            <button
              onClick={refetch}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              {t("common.retry")}
            </button>
          }
        />
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          title={t("orders.empty.title")}
          description={t("orders.empty.description")}
        />
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          emptyMessage={t("admin.overview.noOrders")}
        />
      )}
    </div>
  );
}