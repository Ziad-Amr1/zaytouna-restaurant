import { useEffect, useState } from "react";
import { ChevronLeft, Heart, Minus, Plus, ShoppingBag, ShoppingCart, Sparkles } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { getMenuItem, getMenuItems } from "@/api/menuApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MenuCard from "@/components/common/MenuCard";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import useFavorite from "@/hooks/useFavorite";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

function DishDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { isFavorite: favored, toggleFavorite } = useFavorite(id);

  const [dish, setDish] = useState(null);
  const [suggestedDishes, setSuggestedDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
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
        if (!cancelled) {
          const currentDish = response?.data ?? null;
          setDish(currentDish);

          // Fetch suggested meals
          const allMenuItems = await getMenuItems();
          const items = allMenuItems?.data || [];
          const related = items
            .filter((item) => item.id !== id && (item.category === currentDish?.category || true))
            .slice(0, 4);
          setSuggestedDishes(related);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.status === 404
              ? t("dishDetails.notFound", "Dish not found")
              : t("dishDetails.loadError", "Could not load dish details")
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

  const handleAddToCart = () => {
    if (!dish) return;
    const finalPrice = dish.discountPercent
      ? Math.round(dish.price * (1 - dish.discountPercent / 100))
      : dish.price;
    addItem({ ...dish, price: finalPrice, originalPrice: dish.price }, quantity);
    toast.success(t("menu.addedToCart", { name: dish.name }), {
      action: {
        label: t("nav.cart", "View Cart"),
        onClick: () => navigate("/cart"),
      },
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      toast.error(t("auth.loginRequiredToFavorite", "Please sign in to save favorites"));
      return;
    }
    const nextState = toggleFavorite();
    if (nextState) {
      toast.success(t("menu.addedToFavorites", { name: dish.name }));
    } else {
      toast.info(t("menu.removedFromFavorites", { name: dish.name }));
    }
  };

  const soldOut = dish?.available === false;
  const hasDiscount = Boolean(dish?.discountPercent && dish.discountPercent > 0);
  const finalPrice = hasDiscount
    ? Math.round(dish.price * (1 - dish.discountPercent / 100))
    : dish?.price || 0;

  const backControl = (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      {t("dishDetails.backToMenu", "Back to Menu")}
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {loading ? (
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ) : error || !dish ? (
        <div className="py-16 text-center">
          <p className="text-2xl font-semibold text-foreground">
            {error || t("dishDetails.notFound", "Dish not found")}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            {error && (
              <Button variant="outline" onClick={() => setRetryKey((k) => k + 1)}>
                {t("common.retry", "Retry")}
              </Button>
            )}
            {backControl}
          </div>
        </div>
      ) : (
        <>
          {backControl}

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start lg:gap-12">
            {/* Visual Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg">
              {dish.image ? (
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-6 text-center text-muted-foreground font-medium">
                  {dish.name}
                </div>
              )}

              {hasDiscount && (
                <Badge className="absolute start-4 top-4 bg-rose-600 text-white font-bold text-sm px-3 py-1 shadow-md">
                  -{dish.discountPercent}% OFF
                </Badge>
              )}
            </div>

            {/* Info and Actions */}
            <div className="flex flex-col">
              {dish.category && (
                <p className="text-xs font-bold uppercase tracking-widest text-accent-strong">
                  {dish.category}
                </p>
              )}

              <div className="mt-1 flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {dish.name}
                </h1>

                <button
                  type="button"
                  onClick={handleFavoriteToggle}
                  aria-pressed={favored}
                  title={favored ? "Remove from Favorites" : "Save to Favorites"}
                  className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background shadow-xs transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-muted"
                >
                  <Heart
                    className={cn(
                      "size-5 transition-colors",
                      favored ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-rose-500"
                    )}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Pricing */}
              <div className="mt-4 flex items-baseline gap-3">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                      {formatPrice(finalPrice)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(dish.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-foreground">
                    {formatPrice(dish.price)}
                  </span>
                )}
              </div>

              {dish.description && (
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {dish.description}
                </p>
              )}

              {soldOut ? (
                <div className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-destructive font-semibold text-center">
                  {t("dishDetails.soldOut", "Currently Sold Out")}
                </div>
              ) : (
                <div className="mt-8 space-y-6 border-t border-border pt-6">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {t("dishDetails.quantity", "Quantity")}
                    </span>

                    <div className="flex items-center rounded-xl border border-border bg-background p-1 shadow-xs">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-lg"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="min-w-10 text-center font-bold text-foreground">
                        {quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-lg"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal & Action buttons */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      className="flex-1 rounded-2xl gap-2 font-bold h-12"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="size-5" />
                      {t("menu.addToCart", "Add to Cart")} • {formatPrice(finalPrice * quantity)}
                    </Button>

                    <Button
                      type="button"
                      size="lg"
                      className="flex-1 rounded-2xl gap-2 font-bold h-12 shadow-md"
                      onClick={handleBuyNow}
                    >
                      <ShoppingBag className="size-5" />
                      {t("dishDetails.buyNow", "Order Now")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suggested Meals Section */}
          {suggestedDishes.length > 0 && (
            <div className="mt-16 border-t border-border pt-12">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent-strong">
                    {t("dishDetails.recommendations", "Recommendations")}
                  </p>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mt-1">
                    <Sparkles className="size-5 text-amber-500" />
                    {t("dishDetails.suggestedMeals", "You Might Also Like")}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {suggestedDishes.map((item) => (
                  <MenuCard key={item.id} dish={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DishDetailsPage;