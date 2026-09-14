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
    setFavorite(toggleFavorite(dish.id));
  }

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    addItem(dish);
    toast.success(t("menu.addedToCart", { name: dish.name }));
  }

  const soldOut = dish.available === false;

  return (
    /* h-full: fill the grid cell so all cards are equal height */
    <Card className="group flex h-full flex-col overflow-hidden p-0">
      <div className="relative">
        <Link to={`/menu/${dish.id}`} className="block">
          {/* fixed ratio: identical image boxes for every dish */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            {dish.image ? (
              <img
                src={dish.image}
                alt={dish.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                {dish.name}
              </div>
            )}

            {soldOut && (
              <Badge variant="secondary" className="absolute start-3 top-3">
                {t("menu.soldOut")}
              </Badge>
            )}
          </div>
        </Link>

        {isAuthenticated && (
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-pressed={favorite}
            aria-label={
              favorite
                ? t("menu.removeFavorite", { name: dish.name })
                : t("menu.addFavorite", { name: dish.name })
            }
            className="absolute end-3 top-3 z-10 flex size-9 items-center justify-center rounded-full border border-border bg-background/85 text-foreground shadow-sm backdrop-blur transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)"
          >
            <Heart
              className={cn(
                "size-4",
                favorite && "fill-accent-strong text-accent-strong",
              )}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* min-h reserves 2 lines so 1-line titles don't shrink the card */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-10 text-lg leading-snug text-foreground">
            <Link to={`/menu/${dish.id}`}>{dish.name}</Link>
          </h3>

          <span className="shrink-0 pt-0.5 text-sm font-semibold text-foreground">
            {formatPrice(dish.price)}
          </span>
        </div>

        {/* always rendered — empty fallback keeps every card the same height */}
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
          {dish.category || "\u00A0"}
        </p>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {dish.description || "\u00A0"}
        </p>

        {/* always rendered; mt-auto pins it to the bottom.
            sold-out shows a disabled button so the space is identical */}
        <div className="mt-auto pt-4">
          {soldOut ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full"
              disabled
            >
              {t("menu.soldOut")}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full"
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
