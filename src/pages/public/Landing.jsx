import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Leaf, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getMenuItems } from "@/api/menuApi";
import Categories from "@/components/landing/Categories";
import Newsletter from "@/components/landing/Newsletter";
import PromotionalBanner from "@/components/landing/PromotionalBanner";
import Hero from "@/components/landing/Hero";
import MenuCard from "@/components/common/MenuCard";
import TestimonialCard from "@/components/common/TestimonialCard";
import MenuCardSkeleton from "@/components/menu/MenuCardSkeleton";
import { Button } from "@/components/ui/button";
import testimonials from "@/data/testimonials";

/* Consistent section rhythm — one source of truth */
const SECTION = "mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8";

function SectionHeader({ kicker, title, linkTo, linkLabel }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {kicker && (
          <p className="mb-1 text-xs font-semibold tracking-[0.18em] text-accent-strong uppercase">
            {kicker}
          </p>
        )}
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          {linkLabel}
          <ArrowRight
            className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:motion-safe:group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}

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
        if (!cancelled) setFeatured((response?.data || []).slice(0, 4));
      } catch {
        if (!cancelled) setError(t("landing.error"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadFeatured();
    return () => {
      cancelled = true;
    };
  }, [retryKey, t]);

  const INFO_ITEMS = [
    {
      icon: Leaf,
      title: t("landing.info.oilTitle"),
      desc: t("landing.info.oilDesc"),
    },
    {
      icon: Clock,
      title: t("landing.info.hoursTitle"),
      desc: t("landing.info.hoursDesc"),
    },
    {
      icon: MapPin,
      title: t("landing.info.locationTitle"),
      desc: t("landing.info.locationDesc"),
    },
  ];

  return (
    <>
      {/* Hero — real imagery, single primary CTA */}
      <Hero />

      {/* Info strip — cards with dividers instead of floating rows */}
      <section className={SECTION}>
        <div className="grid divide-y overflow-hidden rounded-2xl border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {INFO_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 p-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-strong">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-foreground">{title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className={SECTION}>
        <SectionHeader
          kicker={t("landing.tagline")}
          title={t("landing.categories.title")}
          linkTo="/menu"
          linkLabel={t("landing.categories.viewAll")}
        />
        <Categories />
      </section>

      {/* Promotional banner */}
      <section className={SECTION}>
        <PromotionalBanner />
      </section>

      {/* Featured dishes */}
      <section id="featured" className={SECTION}>
        <SectionHeader
          title={t("landing.featuredTitle")}
          linkTo="/menu"
          linkLabel={t("landing.fullMenu")}
        />

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <MenuCardSkeleton key={i} />
                ))
              : featured.map((dish) => <MenuCard key={dish.id} dish={dish} />)}
          </div>
        )}

        {!loading && !error && featured.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            {t("landing.menuPreparing")}
          </p>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40">
        <div className={SECTION}>
          <SectionHeader title={t("landing.testimonialsTitle")} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter — its own band, not nested */}
      <section className={SECTION}>
        <Newsletter />
      </section>
    </>
  );
}

export default Landing;
