import { useState } from "react";
import StatCard from "@/components/common/StatCard";
import { DollarSign, TrendingUp, Users, ShoppingBag, BarChart2 } from "lucide-react";

export default function Analytics() {
  const [metrics] = useState({
    monthlyRevenue: "$0.00",
    completedOrders: 0,
    avgOrderValue: "$0.00",
    repeatRate: "0%",
  });
  const [categoryStats] = useState([]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Sales & Operations Analytics</h2>
        <p className="text-sm text-muted-foreground">Financial performance and order analytics for Zaytouna Restaurant.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Monthly Revenue" value={metrics.monthlyRevenue} icon={DollarSign} />
        <StatCard title="Total Completed Orders" value={metrics.completedOrders} icon={ShoppingBag} />
        <StatCard title="Average Order Value" value={metrics.avgOrderValue} icon={TrendingUp} />
        <StatCard title="Repeat Customers" value={metrics.repeatRate} icon={Users} />
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground">Sales Distribution by Menu Category</h3>
        {categoryStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <BarChart2 className="h-8 w-8 stroke-1" />
            <p className="text-sm font-medium">No sales data recorded to display distribution charts.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categoryStats.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-foreground">{item.category}</span>
                  <span className="text-emerald-600">{item.sales} ({item.share})</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: item.share }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}