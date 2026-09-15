import { useState } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

export default function RevenueOverview({ totalRevenue, thisMonthRevenue, growthPercent, dailyRevenue = [] }) {
  const { t, i18n } = useTranslation();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const isGrowthPositive = growthPercent > 0;
  const isGrowthNegative = growthPercent < 0;
  const GrowthIcon = isGrowthNegative ? TrendingDown : isGrowthPositive ? TrendingUp : Minus;

  const maxRevenue = Math.max(...dailyRevenue.map((d) => d.revenue), 100);

  // Generate SVG path for line chart
  const width = 600;
  const height = 180;
  const padding = 20;

  const points = dailyRevenue.map((d, i) => {
    const x = padding + (i / Math.max(dailyRevenue.length - 1, 1)) * (width - 2 * padding);
    const y = height - padding - (d.revenue / maxRevenue) * (height - 2 * padding);
    return { ...d, x, y };
  });

  const pathD = points.length
    ? points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "")
    : "";

  const areaD = points.length
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  return (
    <Card className="h-full border-border bg-card shadow-sm">
      <CardHeader className="gap-1.5 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t("admin.overview.dailyRevenue")}
        </span>

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {formatPrice(totalRevenue)}
          </p>

          <div
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isGrowthPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : isGrowthNegative
                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <GrowthIcon className="size-3.5" aria-hidden="true" />
            <span>
              {growthPercent > 0 ? `+${growthPercent.toFixed(1)}%` : `${growthPercent.toFixed(1)}%`}
            </span>
          </div>
        </div>

        <CardDescription>
          {t("landing.tagline")} · {t("admin.overview.subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-muted/30 p-4">
          <div>
            <span className="text-xs text-muted-foreground">
              {t("profile.memberSince")} / {t("cart.subtotal")}
            </span>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
              {formatPrice(thisMonthRevenue)}
            </p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">7-Day Trend</span>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
              {dailyRevenue.length} Days Active
            </p>
          </div>
        </div>

        {/* Interactive SVG Trend Line & Area Chart */}
        <div className="relative w-full overflow-hidden rounded-xl border border-border bg-muted/10 p-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--color-primary, #3b82f6)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((fraction) => (
              <line
                key={fraction}
                x1={padding}
                y1={height - padding - fraction * (height - 2 * padding)}
                x2={width - padding}
                y2={height - padding - fraction * (height - 2 * padding)}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area fill */}
            <path d={areaD} fill="url(#revenueGradient)" />

            {/* Main trend line */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-primary, #3b82f6)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points */}
            {points.map((p) => {
              const dateLabel = new Date(p.dateKey).toLocaleDateString(i18n.language, {
                weekday: "short",
                month: "numeric",
                day: "numeric",
              });
              const isHovered = hoveredPoint?.dateKey === p.dateKey;

              return (
                <g key={p.dateKey} className="cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4}
                    className="fill-background stroke-primary stroke-2 transition-all"
                    onMouseEnter={() => setHoveredPoint({ ...p, label: dateLabel })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredPoint && (
            <div className="absolute top-2 end-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs shadow-md">
              <p className="font-semibold text-foreground">{hoveredPoint.label}</p>
              <p className="tabular-nums text-primary font-bold">{formatPrice(hoveredPoint.revenue)}</p>
              <p className="text-muted-foreground">{hoveredPoint.orders} orders</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
