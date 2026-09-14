import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getMenuItem } from "@/api/menuApi";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function DishDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      setDish(null);
      try {
        const response = await getMenuItem(id);
        if (!cancelled) setDish(response?.data ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.status === 404
              ? "We couldn't find that dish."
              : "We couldn't load this dish right now. Please try again."
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
  }, [id]);

  const handleBack = () => {
    const from = location.state?.from;
    navigate(from || "/menu");
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
      Back to menu
    </button>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
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
              <p className="text-2xl font-semibold text-foreground">{error || "Dish not found."}</p>
              <div className="mt-6 flex justify-center">{backControl}</div>
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

                  <h1 className="mt-1 text-3xl font-bold leading-tight text-foreground">
                    {dish.name}
                  </h1>

                  <p className="mt-3 text-2xl font-semibold text-foreground">EGP {dish.price}</p>

                  {dish.description && (
                    <p className="mt-4 leading-relaxed text-muted-foreground">{dish.description}</p>
                  )}

                  {dish.available === false ? (
                    <p className="mt-6 inline-block rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
                      Currently sold out
                    </p>
                  ) : (
                    <p className="mt-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                      Available tonight
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DishDetailsPage;