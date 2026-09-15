import { useCallback, useEffect, useState } from "react";
import { Calendar, DollarSign, RefreshCcw, ShoppingBag, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getMenuItems } from "@/api/menuApi";
import { getAllOrders } from "@/api/ordersApi";
import { getAllReservations } from "@/api/reservationsApi";
import DataTable from "@/components/common/DataTable";
import StatCard from "@/components/common/StatCard";
import StatusBadge from "@/components/common/StatusBadge";
import RevenueOverview from "@/components/admin/dashboard/RevenueOverview";
import OrderStatusCard from "@/components/admin/dashboard/OrderStatusCard";
import TopProductsCard from "@/components/admin/dashboard/TopProductsCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime, formatPrice } from "@/lib/format";
import { computeFullDashboardData } from "@/lib/statistics";

function SkeletonStats() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersRes, menuRes, reservationsRes] = await Promise.all([
        getAllOrders(),
        getMenuItems(),
        getAllReservations(),
      ]);
      const orderList = ordersRes.data || [];
      const menuList = menuRes.data || [];
      const resList = reservationsRes.data || [];

      setData(computeFullDashboardData(orderList, menuList, resList));
    } catch {
      setError(t("admin.overview.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const columns = [
    { header: t("admin.table.orderId"), accessor: "id" },
    { header: t("admin.table.customerId"), accessor: "userId" },
    {
      header: t("admin.table.dishesOrdered"),
      accessor: "items",
      render: (row) => {
        const count = (row.items || []).reduce((sum, item) => sum + item.quantity, 0);
        return t("admin.table.itemsCount", { count });
      },
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
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("admin.overview.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.overview.subtitle")}
          </p>
        </div>
        {error ? (
          <Button variant="outline" onClick={() => void load()}>
            <RefreshCcw className="mr-2 size-4" aria-hidden="true" /> {t("common.retry")}
          </Button>
        ) : null}
      </div>

      {loading ? (
        <SkeletonStats />
      ) : error || !data ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-8 text-center text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t("admin.overview.dailyRevenue")}
              value={formatPrice(data.totalRevenue)}
              icon={DollarSign}
            />
            <StatCard
              title={t("admin.overview.todayOrders")}
              value={data.totalOrders}
              icon={ShoppingBag}
            />
            <StatCard
              title={t("admin.overview.tableBookings")}
              value={data.tableBookings}
              icon={Calendar}
            />
            <StatCard
              title={t("admin.overview.activeCustomers")}
              value={data.activeCustomers}
              icon={Users}
            />
          </div>

          {/* Revenue Trend & Order Status Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <RevenueOverview
                totalRevenue={data.totalRevenue}
                thisMonthRevenue={data.thisMonthRevenue}
                growthPercent={data.growthPercent}
                dailyRevenue={data.dailyRevenue}
              />
            </div>
            <div className="lg:col-span-4">
              <OrderStatusCard
                ordersByStatus={data.ordersByStatus}
                totalOrders={data.totalOrders}
              />
            </div>
          </div>

          {/* Top Selling Products & Recent Orders */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <TopProductsCard products={data.topProducts} />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-foreground">
                  {t("admin.overview.recentOrders")}
                </h3>
                <DataTable
                  columns={columns}
                  data={data.recentOrders}
                  emptyMessage={t("admin.overview.noOrders")}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}