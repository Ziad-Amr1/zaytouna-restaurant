import { useEffect, useState } from "react";
import { ChevronLeft, Heart, Loader2, Minus, Plus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getMenuItem } from "@/api/menuApi";
import { createOrder } from "@/api/ordersApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import useFavorite from "@/hooks/useFavorite";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

function DishDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isFavorite: favored, toggleFavorite } = useFavorite(id);

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      setDish(null);
      setQuantity(1);
      try {
        const response = await getMenuItem(id);
        if (!cancelled) setDish(response?.data ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.status === 404
              ? t("dishDetails.notFound")
              : t("dishDetails.loadError")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [id, retryKey, t]);

  const handleBack = () => {
    const from = location.state?.from;
    navigate(from || "/menu");
  };

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (!dish || placing) return;

    setPlacing(true);
    try {
      await createOrder([{ menuItemId: dish.id, quantity }]);
      toast.success(t("dishDetails.orderPlaced"), {
        description: t("dishDetails.orderPlacedDesc", {
          quantity,
          name: dish.name,
        }),
      });
      navigate("/orders");
    } catch (err) {
      toast.error(
        err.response?.data?.message || t("cart.orderFailed")
      );
    } finally {
      setPlacing(false);
    }
  };

  const backControl = (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      {t("dishDetails.backToMenu")}
    </button>
  );

  const soldOut = dish?.available === false;

  const quantityControl = () => (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          {t("dishDetails.quantity")}
        </span>
        <div className="flex items-center rounded-lg border border-border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none rounded-s-lg"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || placing}
            aria-label={t("dishDetails.decreaseQuantity")}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </Button>
          <span className="min-w-10 text-center text-sm font-semibold text-foreground">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-none rounded-e-lg"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={placing}
            aria-label={t("dishDetails.increaseQuantity")}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xl font-semibold text-foreground">
          {formatPrice(dish.price * quantity)}
        </span>
        <Button size="lg" onClick={handleOrder} disabled={placing} className="min-w-44">
          {placing ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              {t("dishDetails.placingOrder")}
            </>
          ) : (
            t("dishDetails.placeOrder")
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {loading ? (
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      ) : error || !dish ? (
        <div className="py-16 text-center">
          <p className="text-2xl font-semibold text-foreground">
            {error || t("dishDetails.notFound")}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            {error && (
              <Button variant="outline" onClick={() => setRetryKey((k) => k + 1)}>
                {t("common.retry")}
              </Button>
            )}
            {backControl}
          </div>
        </div>
      ) : (
        <>
          {backControl}

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start">
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-muted">
              {dish.image ? (
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4 text-center text-muted-foreground">
                  {dish.name}
                </div>
              )}
            </div>

            <div>
              {dish.category && (
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {dish.category}
                </p>
              )}

              <div className="flex items-start justify-between gap-3">
                <h1 className="mt-1 text-3xl font-bold leading-tight text-foreground">
                  {dish.name}
                </h1>
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => void toggleFavorite()}
                    aria-pressed={favored}
                    aria-label={
                      favored
                        ? t("menu.removeFavorite", { name: dish.name })
                        : t("menu.addFavorite", { name: dish.name })
                    }
                    className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Heart
                      className={cn("size-5", favored && "fill-accent-strong text-accent-strong")}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>

              <p className="mt-3 text-2xl font-semibold text-foreground">
                {formatPrice(dish.price)}
              </p>

              {dish.description && (
                <p className="mt-4 leading-relaxed text-muted-foreground">{dish.description}</p>
              )}

              {soldOut ? (
                <p className="mt-6 inline-block rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
                  {t("dishDetails.soldOut")}
                </p>
              ) : (
                <>
                  <p className="mt-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    {t("dishDetails.availableTonight")}
                  </p>
                  {quantityControl()}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DishDetailsPage;