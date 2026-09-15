import { useCallback } from "react";
import { CheckCircle2, DollarSign, Receipt, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getMenuItems } from "@/api/menuApi";
import { getAllOrders } from "@/api/ordersApi";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import useFetchData from "@/hooks/useFetchData";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { computeAnalytics, computeCategoryStats } from "@/lib/statistics";

export default function Analytics() {
  const { t } = useTranslation();

  const fetchAnalytics = useCallback(async () => {
    const [ordersRes, menuRes] = await Promise.all([getAllOrders(), getMenuItems()]);
    const orders = ordersRes.data || [];
    const menuItems = menuRes.data || [];
    return {
      stats: computeAnalytics(orders),
      categoryStats: computeCategoryStats(orders, menuItems),
    };
  }, []);

  const { data, loading, error, refetch } = useFetchData(fetchAnalytics);

  const stats = data?.stats;
  const categoryStats = data?.categoryStats || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("admin.nav.analytics")}
        description="Track performance trends, sales distribution, and customer behavior."
        onRefresh={error ? refetch : undefined}
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-8 w-20" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-8 text-center text-sm text-destructive">
          {error}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t("admin.overview.dailyRevenue")}
            value={formatPrice(stats.monthlyRevenue)}
            icon={DollarSign}
          />
          <StatCard
            title={t("cart.orderPlaced")}
            value={stats.completedOrders}
            icon={CheckCircle2}
          />
          <StatCard
            title={t("cart.subtotal")}
            value={formatPrice(stats.avgOrderValue)}
            icon={Receipt}
          />
          <StatCard
            title={t("admin.overview.activeCustomers")}
            value={`${stats.repeatRate.toFixed(1)}%`}
            icon={Users}
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between border-b border-border px-1 pb-4">
          <h3 className="text-base font-bold text-foreground">Sales Distribution by Menu Category</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : categoryStats.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No completed orders yet to build a sales breakdown.
          </p>
        ) : (
          <div className="space-y-5">
            {categoryStats.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.category}</span>
                  <span className="text-muted-foreground">
                    {formatPrice(item.sales)} ({item.share}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    role="progressbar"
                    aria-valuenow={item.share}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${item.category}: ${item.share}%`}
                    className={cn("h-full rounded-full", item.color)}
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}