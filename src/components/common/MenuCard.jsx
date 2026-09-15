import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

function MenuCard({ dish }) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [favorite, setFavorite] = useState(() => isFavorite(dish.id));

  useEffect(() => {
    function handleFavoritesChange() {
      setFavorite(isFavorite(dish.id));
    }

    window.addEventListener("favorites:change", handleFavoritesChange);
    return () => {
      window.removeEventListener("favorites:change", handleFavoritesChange);
    };
  }, [dish.id]);

  function handleFavoriteClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t("auth.loginRequiredToFavorite", "Please sign in to save favorites"));
      return;
    }
    const nextState = toggleFavorite(dish.id);
    setFavorite(nextState);
    if (nextState) {
      toast.success(t("menu.addedToFavorites", { name: dish.name }));
    } else {
      toast.info(t("menu.removedFromFavorites", { name: dish.name }));
    }
  }

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    const finalPrice = dish.discountPercent
      ? Math.round(dish.price * (1 - dish.discountPercent / 100))
      : dish.price;
    addItem({ ...dish, price: finalPrice, originalPrice: dish.price });
    toast.success(t("menu.addedToCart", { name: dish.name }));
  }

  const soldOut = dish.available === false;
  const hasDiscount = Boolean(dish.discountPercent && dish.discountPercent > 0);
  const finalPrice = hasDiscount
    ? Math.round(dish.price * (1 - dish.discountPercent / 100))
    : dish.price;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-0 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
      <div className="relative">
        <Link to={`/menu/${dish.id}`} className="block overflow-hidden">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            {dish.image ? (
              <img
                src={dish.image}
                alt={dish.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/60 p-4 text-center text-sm font-medium text-muted-foreground">
                {dish.name}
              </div>
            )}

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 pointer-events-none">
              <div className="flex flex-col gap-1 items-start pointer-events-auto">
                {soldOut && (
                  <Badge variant="secondary" className="bg-destructive/90 text-destructive-foreground backdrop-blur-md">
                    {t("menu.soldOut")}
                  </Badge>
                )}
                {hasDiscount && !soldOut && (
                  <Badge className="bg-rose-600 text-white font-bold backdrop-blur-md shadow-xs">
                    -{dish.discountPercent}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* Favorite Heart Button - pointer events enabled, stop propagation */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-pressed={favorite}
          aria-label={
            favorite
              ? t("menu.removeFavorite", { name: dish.name })
              : t("menu.addFavorite", { name: dish.name })
          }
          className="absolute end-3 top-3 z-20 flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground shadow-md backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-background"
        >
          <Heart
            className={cn(
              "size-4.5 transition-colors duration-300",
              favorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-rose-500"
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-h-10 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            <Link to={`/menu/${dish.id}`}>{dish.name}</Link>
          </h3>

          <div className="shrink-0 text-end">
            {hasDiscount ? (
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(dish.price)}
                </span>
                <span className="text-base font-bold text-rose-600 dark:text-rose-400">
                  {formatPrice(finalPrice)}
                </span>
              </div>
            ) : (
              <span className="text-base font-bold text-foreground">
                {formatPrice(dish.price)}
              </span>
            )}
          </div>
        </div>

        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-accent-strong">
          {dish.category || "\u00A0"}
        </p>

        <p className="mt-2 line-clamp-2 min-h-9 text-xs leading-relaxed text-muted-foreground">
          {dish.description || "\u00A0"}
        </p>

        <div className="mt-auto pt-4">
          {soldOut ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full rounded-xl"
              disabled
            >
              {t("menu.soldOut")}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              className="w-full rounded-xl gap-2 font-semibold shadow-xs"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="size-4" aria-hidden="true" />
              {t("menu.addToCart")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default MenuCard;
