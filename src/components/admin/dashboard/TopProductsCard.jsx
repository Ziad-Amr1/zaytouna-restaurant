import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

export default function TopProductsCard({ products = [] }) {
  const { t } = useTranslation();

  return (
    <Card className="h-full border-border bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-foreground">
          Top Selling Dishes
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {products.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No product sales data recorded yet.
          </p>
        ) : (
          products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center gap-3.5 rounded-xl border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary tabular-nums">
                #{index + 1}
              </span>

              <div className="size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Package className="size-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {t("admin.table.itemsCount", { count: product.totalSold })}
                </p>
              </div>

              <div className="text-end shrink-0">
                <p className="text-sm font-bold tabular-nums text-foreground">
                  {formatPrice(product.revenue)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
