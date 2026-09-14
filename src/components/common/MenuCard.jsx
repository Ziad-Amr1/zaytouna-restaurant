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
    <Card className="group flex flex-col overflow-hidden p-0">
      <div className="relative">
        <Link to={`/menu/${dish.id}`} className="block">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            {dish.image ? (
              <img
                src={dish.image}
                alt={dish.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
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
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug text-foreground">
            <Link to={`/menu/${dish.id}`}>{dish.name}</Link>
          </h3>

          <span className="shrink-0 text-sm font-semibold text-foreground">
            {formatPrice(dish.price)}
          </span>
        </div>

        {dish.category && (
          <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
            {dish.category}
          </p>
        )}

        {dish.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {dish.description}
          </p>
        )}

        {!soldOut && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="mt-4 w-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            {t("menu.addToCart")}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default MenuCard;