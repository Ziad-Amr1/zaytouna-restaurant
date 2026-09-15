import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function OrderStatusCard({ ordersByStatus = [], totalOrders = 0 }) {
  const { t } = useTranslation();

  return (
    <Card className="h-full border-border bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-foreground">
          {t("admin.table.status")} Breakdown
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* SVG Donut Visual */}
        <div className="relative mx-auto flex size-44 items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.8"
              className="text-muted/30"
            />
            {ordersByStatus.map((item, idx) => {
              const prevPercent = ordersByStatus
                .slice(0, idx)
                .reduce((acc, curr) => acc + curr.percent, 0);
              const strokeDasharray = `${item.percent} ${100 - item.percent}`;
              const strokeDashoffset = -prevPercent;

              return (
                <circle
                  key={item.id}
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="3.8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  pathLength="100"
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {totalOrders}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {t("admin.overview.todayOrders")}
            </span>
          </div>
        </div>

        {/* Status List with Progress Bars */}
        <ul className="space-y-3">
          {ordersByStatus.map((item) => (
            <li key={item.id} className="space-y-1 text-sm">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="capitalize text-foreground">{item.id}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground tabular-nums">
                  <span className="font-semibold text-foreground">{item.count}</span>
                  <span>({Math.round(item.percent)}%)</span>
                </div>
              </div>
              <Progress value={item.percent} className="h-1.5" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
