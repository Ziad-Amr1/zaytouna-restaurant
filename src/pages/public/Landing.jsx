import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Leaf, MapPin } from "lucide-react";

import { getMenuItems } from "@/api/menuApi";
import MenuCard from "@/components/common/MenuCard";
import ReservationModal from "@/components/common/ReservationModal";
import TestimonialCard from "@/components/common/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import testimonials from "@/data/testimonials";

function Landing() {
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
          setError("We couldn't load the menu right now. Please try again.");
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
  }, [retryKey]);

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
          <div>
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              Levantine table, Cairo kitchen
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-bold text-foreground sm:text-5xl">
              Olive oil, open fire, and a table that&apos;s always being set for you.
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              Zaytouna serves slow-cooked mezze and charcoal grills the way they&apos;re meant to
              be shared — order ahead for pickup, or reserve a table for tonight.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/menu">Browse the menu</Link>
              </Button>
              <ReservationModal
                trigger={<Button variant="outline" size="lg">Reserve a table</Button>}
              />
              <Button variant="outline" size="lg" asChild>
                <a href="#featured">See tonight&apos;s dishes</a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4" aria-hidden="true">
            <div className="aspect-[3/4] rounded-2xl bg-muted" />
            <div className="aspect-[3/4] translate-y-6 rounded-2xl bg-muted" />
            <div className="aspect-[3/4] rounded-2xl bg-muted" />
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Leaf className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">Cold-pressed, always</p>
              <p className="text-sm text-muted-foreground">Everything starts with our own olive oil.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">Open 12pm – 1am</p>
              <p className="text-sm text-muted-foreground">Kitchen takes last orders at midnight.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">Maadi, Cairo</p>
              <p className="text-sm text-muted-foreground">Street parking and valet after 7pm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured dishes */}
      <section id="featured" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            From the kitchen tonight
          </h2>
          <Link
            to="/menu"
            className="text-sm font-medium text-primary hover:underline"
          >
            Full menu →
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
              Try again
            </Button>
          </div>
        )}

        {!error && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5]" />
                ))
              : featured.map((dish) => <MenuCard key={dish.id} dish={dish} />)}
          </div>
        )}

        {!loading && !error && featured.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            The menu is being prepared — check back soon.
          </p>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">What regulars say</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;