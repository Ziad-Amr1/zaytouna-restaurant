import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getMenuItem } from "@/api/menuApi";
import EmptyState from "@/components/common/EmptyState";
import MenuCard from "@/components/common/MenuCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getFavorites } from "@/lib/favorites";

function FavoritesPage() {
  const { t } = useTranslation();

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      setLoading(true);
      setError("");

      try {
        const ids = getFavorites();

        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const response = await getMenuItem(id);
              return response?.data || null;
            } catch {
              return null;
            }
          }),
        );

        if (cancelled) {
          return;
        }

        setDishes(results.filter(Boolean));
      } catch {
        if (cancelled) {
          return;
        }

        setDishes([]);
        setError(t("favorites.error"));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFavorites();

    function handleFavoritesChange() {
      loadFavorites();
    }

    window.addEventListener("favorites:change", handleFavoritesChange);

    return () => {
      cancelled = true;
      window.removeEventListener("favorites:change", handleFavoritesChange);
    };
  }, [t]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t("favorites.title")}
      </h1>

      <p className="mt-1 text-muted-foreground">
        {loading ? (
          t("favorites.loading")
        ) : (
          <span aria-live="polite">
            {t("favorites.savedCount", { count: dishes.length })}
          </span>
        )}
      </p>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-4/5" />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title={t("common.somethingWentWrong")}
            description={error}
          />
        ) : dishes.length === 0 ? (
          <EmptyState
            icon={Heart}
            title={t("favorites.empty.title")}
            description={t("favorites.empty.description")}
            action={
              <Button asChild>
                <Link to="/menu">{t("favorites.empty.action")}</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dishes.map((dish) => (
              <MenuCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
