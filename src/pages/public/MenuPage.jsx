import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { getMenuItems } from "@/api/menuApi";
import MenuCard from "@/components/common/MenuCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function MenuPage() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
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
                : ["all", ...new Set(items.map((d) => d.category).filter(Boolean))]
            );
          }
        } catch {
          if (!cancelled) {
            setError("We couldn't load the menu right now. Please try again.");
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
  }, [search, category, reloadKey]);

  const visibleCategories = categories.length ? categories : ["all"];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Our menu</h1>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Everything here is made to order — dishes marked sold out will be back on the next
            delivery of that ingredient.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                placeholder="Search dishes…"
                className="ps-10"
                aria-label="Search dishes"
              />
            </div>

            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
              {visibleCategories.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setLoading(true);
                      setError("");
                    }}
                    aria-pressed={isActive}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {cat === "all" ? "All" : cat}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
            {!loading && !error
              ? `${dishes.length} ${dishes.length === 1 ? "dish" : "dishes"}`
              : ""}
          </p>

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
                Try again
              </Button>
            </div>
          )}

          {!error && (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                  ))
                : dishes.map((dish) => <MenuCard key={dish.id} dish={dish} />)}
            </div>
          )}

          {!loading && !error && dishes.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">
              Nothing matches that search. Try a different dish name or category.
            </p>
          )}
        </section>
  );
}

export default MenuPage;