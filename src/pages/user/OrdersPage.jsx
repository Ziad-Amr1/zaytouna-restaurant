import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getMyOrders } from "@/api/ordersApi";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime, formatPrice } from "@/lib/format";

function OrderItems({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={`${item.menuItemId}-${index}`}
          className="flex items-baseline justify-between gap-4 text-sm"
        >
          <span className="text-foreground">
            {item.name}
            <span className="ml-1 text-muted-foreground">
              × {item.quantity}
            </span>
          </span>

          <span className="shrink-0 text-muted-foreground">
            {formatPrice(item.lineTotal)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function OrdersPage() {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getMyOrders();

        if (!cancelled) {
          setOrders(response?.data || []);
        }
      } catch {
        if (!cancelled) {
          setError(t("orders.error"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [retryKey, t]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t("orders.title")}
      </h1>

      <p className="mt-1 text-muted-foreground">{t("orders.subtitle")}</p>

      <div className="mt-8 space-y-5">
        {loading ? (
          <>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </div>
          </>
        ) : error ? (
          <EmptyState
            title={t("common.somethingWentWrong")}
            description={error}
            action={
              <Button
                variant="outline"
                onClick={() => setRetryKey((k) => k + 1)}
              >
                {t("common.retry")}
              </Button>
            }
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={t("orders.empty.title")}
            description={t("orders.empty.description")}
            action={
              <Button asChild>
                <Link to="/menu">{t("orders.empty.action")}</Link>
              </Button>
            }
          />
        ) : (
          orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.orderNumber", { id: order.id })}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>

                <StatusBadge status={order.status} />
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <OrderItems items={order.items} />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("orders.total")}
                </span>

                <span className="text-lg font-bold text-foreground">
                  {formatPrice(order.total)}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
