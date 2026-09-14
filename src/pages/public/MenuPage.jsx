import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { getMenuItems } from "@/api/menuApi";
import MenuCard from "@/components/common/MenuCard";
import ActiveFiltersBar from "@/components/menu/ActiveFiltersBar";
import MenuCardSkeleton from "@/components/menu/MenuCardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function MenuPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [categories, setCategories] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(() => {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== "all") params.category = category;

      const load = async () => {
        try {
          const response = await getMenuItems(params);
          if (cancelled) return;
          const items = response?.data || [];
          setDishes(items);
          if (!params.search && !params.category) {
            setCategories((prev) =>
              prev.length
                ? prev
                : [
                    "all",
                    ...new Set(items.map((d) => d.category).filter(Boolean)),
                  ],
            );
          }
        } catch {
          if (!cancelled) {
            setError(t("menu.error"));
            setDishes([]);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      void load();
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [search, category, reloadKey, t]);

  const visibleCategories = categories.length ? categories : ["all"];

  function selectCategory(next) {
    setCategory(next);
    setLoading(true);
    setError("");
    setSearchParams(next === "all" ? {} : { category: next }, {
      replace: true,
    });
  }

  function clearSearch() {
    setSearch("");
    setLoading(true);
    setError("");
  }

  function clearFilters() {
    clearSearch();
    selectCategory("all");
  }

  const hasActiveFilters =
    Boolean(search.trim()) || (category !== "all" && category !== "");

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
        {t("menu.title")}
      </h1>
      <p className="mt-2 max-w-lg text-muted-foreground">{t("menu.intro")}</p>

      {/* Sticky controls */}
      <div className="sticky top-16 z-30 -mx-4 border-b bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:max-w-xs">
            <Search
              className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setLoading(true);
                setError("");
              }}
              placeholder={t("menu.searchPlaceholder")}
              className="ps-10 pe-9"
              aria-label={t("menu.searchLabel")}
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label={t("menu.clearSearch")}
                className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div
            role="group"
            aria-label={t("menu.filterByCategory")}
            className="flex flex-wrap gap-2"
          >
            {visibleCategories.map((cat) => {
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => selectCategory(cat)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {cat === "all" ? t("menu.allCategories") : cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ActiveFiltersBar
          resultsCount={dishes.length}
          applied={{ category, search }}
          hasActiveFilters={hasActiveFilters}
          clearCategory={() => selectCategory("all")}
          clearSearch={clearSearch}
          clearFilters={clearFilters}
        />
      </div>

      {error && (
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-4 text-sm text-destructive">
          <p>{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setReloadKey((k) => k + 1);
              setLoading(true);
              setError("");
            }}
          >
            {t("common.retry")}
          </Button>
        </div>
      )}

      {!error && (
        /* auto-rows-fr: every row matches the tallest row — all cards equal height */
        <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <MenuCardSkeleton key={i} />
              ))
            : dishes.map((dish) => <MenuCard key={dish.id} dish={dish} />)}
        </div>
      )}

      {!loading && !error && dishes.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">
          {t("menu.empty")}
        </p>
      )}
    </section>
  );
}

export default MenuPage;
