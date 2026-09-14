import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Leaf, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getMenuItems } from "@/api/menuApi";
import Categories from "@/components/landing/Categories";
import Newsletter from "@/components/landing/Newsletter";
import PromotionalBanner from "@/components/landing/PromotionalBanner";
import MenuCard from "@/components/common/MenuCard";
import ReservationModal from "@/components/common/ReservationModal";
import TestimonialCard from "@/components/common/TestimonialCard";
import MenuCardSkeleton from "@/components/menu/MenuCardSkeleton";
import { Button } from "@/components/ui/button";
import testimonials from "@/data/testimonials";
import { cn } from "@/lib/utils";

function Landing() {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadFeatured = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getMenuItems();
        if (!cancelled) {
          setFeatured((response?.data || []).slice(0, 4));
        }
      } catch {
        if (!cancelled) {
          setError(t("landing.error"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadFeatured();

    return () => {
      cancelled = true;
    };
  }, [retryKey, t]);

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <div>
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              {t("landing.tagline")}
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-bold text-foreground sm:text-5xl">
              {t("landing.title")}
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              {t("landing.description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/menu">{t("landing.browseMenu")}</Link>
              </Button>
              <ReservationModal
                trigger={
                  <Button variant="outline" size="lg">
                    {t("landing.reserveTable")}
                  </Button>
                }
              />
              <Button variant="outline" size="lg" asChild>
                <a href="#featured">{t("landing.seeTonight")}</a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "aspect-[3/4] rounded-2xl bg-linear-to-b from-muted to-muted/40",
                  i === 1 && "translate-y-6",
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Leaf
              className="mt-0.5 size-5 shrink-0 text-foreground"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-foreground">
                {t("landing.info.oilTitle")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("landing.info.oilDesc")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock
              className="mt-0.5 size-5 shrink-0 text-foreground"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-foreground">
                {t("landing.info.hoursTitle")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("landing.info.hoursDesc")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin
              className="mt-0.5 size-5 shrink-0 text-foreground"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-foreground">
                {t("landing.info.locationTitle")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("landing.info.locationDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Categories />
      </section>

      {/* Promotional banner */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <PromotionalBanner />
      </section>

      {/* Featured dishes */}
      <section
        id="featured"
        className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("landing.featuredTitle")}
          </h2>
          <Link
            to="/menu"
            className="text-sm font-medium text-primary hover:underline"
          >
            {t("landing.fullMenu")} →
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setRetryKey((k) => k + 1)}
            >
              {t("common.retry")}
            </Button>
          </div>
        )}

        {!error && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <MenuCardSkeleton key={i} />
                ))
              : featured.map((dish) => (
                  <MenuCard key={dish.id} dish={dish} />
                ))}
          </div>
        )}

        {!loading && !error && featured.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            {t("landing.menuPreparing")}
          </p>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("landing.testimonialsTitle")}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>

          <Newsletter />
        </div>
      </section>
    </>
  );
}

export default Landing;