import { useEffect, useState } from "react";
import { CheckCircle2, DollarSign, Receipt, RefreshCcw, Users } from "lucide-react";

import { getMenuItems } from "@/api/menuApi";
import { getAllOrders } from "@/api/ordersApi";
import StatCard from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { computeAnalytics, computeCategoryStats } from "@/lib/statistics";

export default function Analytics() {
  const [categoryStats, setCategoryStats] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersRes, menuRes] = await Promise.all([getAllOrders(), getMenuItems()]);
      const orders = ordersRes.data || [];
      const menuItems = menuRes.data || [];
      setStats(computeAnalytics(orders));
      setCategoryStats(computeCategoryStats(orders, menuItems));
    } catch {
      setError("We couldn't load analytics right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Business Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Track performance trends, sales distribution, and customer behavior.
          </p>
        </div>
        {error ? (
          <Button variant="outline" onClick={() => void load()}>
            <RefreshCcw className="mr-2 size-4" aria-hidden="true" /> Retry
          </Button>
        ) : null}
      </div>

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
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Monthly Revenue"
            value={formatPrice(stats.monthlyRevenue)}
            icon={DollarSign}
          />
          <StatCard
            title="Total Completed Orders"
            value={stats.completedOrders}
            icon={CheckCircle2}
          />
          <StatCard
            title="Average Order Value"
            value={formatPrice(stats.avgOrderValue)}
            icon={Receipt}
          />
          <StatCard
            title="Repeat Customer Rate"
            value={`${stats.repeatRate.toFixed(1)}%`}
            icon={Users}
          />
        </div>
      )}

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