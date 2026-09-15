import { Button } from "@/components/ui/button";
import ReservationModal from "@/components/common/ReservationModal";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center border-b bg-muted/30 py-6 sm:py-8 lg:py-0">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Mobile-Dedicated Hero View (< md breakpoint) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card shadow-xl md:hidden">
          {/* Hero Food Image Banner with Overlay Scrim */}
          <div className="relative h-64 w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
              alt="Zaytouna Mediterranean Gourmet Cuisine"
              className="size-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

            {/* Floating Rating Pill */}
            <div className="absolute top-3.5 start-3.5 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-md">
              <span className="text-amber-400">★</span> 4.9
              <span className="text-[10px] text-white/80 font-normal">(2.4k+ reviews)</span>
            </div>

            {/* Open Now Live Status Badge */}
            <div className="absolute top-3.5 end-3.5 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2.5 py-1 text-[11px] font-bold text-emerald-400 backdrop-blur-md">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open Now</span>
            </div>
          </div>

          {/* Hero Content Section */}
          <div className="relative -mt-6 px-5 pb-6 pt-1 flex flex-col space-y-4 bg-card rounded-t-3xl">
            <div>
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                {t("landing.tagline")}
              </span>
              <h1 className="mt-2 text-2xl font-black leading-tight text-foreground sm:text-3xl">
                {t("landing.title")}
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {t("landing.description")}
              </p>
            </div>

            {/* Action Buttons Stack */}
            <div className="space-y-2.5 pt-1">
              <Button asChild size="lg" className="w-full rounded-2xl font-bold shadow-md">
                <Link to="/menu">
                  {t("landing.browseMenu")}
                </Link>
              </Button>

              <ReservationModal
                trigger={
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-2xl font-semibold border-border bg-background"
                  >
                    {t("landing.reserveTable")}
                  </Button>
                }
              />
            </div>

            {/* Feature Highlights Row */}
            <div className="pt-3 flex items-center justify-between text-[11px] font-medium text-muted-foreground border-t border-border/60">
              <span className="flex items-center gap-1">⚡ Fast Delivery</span>
              <span className="flex items-center gap-1">🌿 100% Fresh</span>
              <span className="flex items-center gap-1">🏆 Award Winning</span>
            </div>
          </div>
        </div>

        {/* Desktop / Tablet Grid Hero View (>= md breakpoint) */}
        <div className="hidden grid-cols-2 items-center gap-10 md:grid md:gap-12">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
              {t("landing.tagline")}
            </p>

            <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-[1.08] text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              {t("landing.title")}
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base md:text-lg">
              {t("landing.description")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/menu">
                  {t("landing.browseMenu")}
                </Link>
              </Button>

              <ReservationModal
                trigger={
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {t("landing.reserveTable")}
                  </Button>
                }
              />

              <a
                href="#featured"
                className="inline-flex min-h-10 items-center justify-center px-2 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:justify-start"
              >
                {t("landing.seeTonight")} ↓
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-6 sm:py-8 lg:max-w-md lg:py-12">
            <div className="relative aspect-[4/3.8] w-full overflow-hidden rounded-3xl border border-border shadow-xl transition-all duration-500 hover:shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
                alt="Zaytouna Restaurant Mediterranean Gourmet Cuisine"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="absolute -bottom-1 start-2 rounded-2xl border border-border/80 bg-background/95 p-3.5 shadow-xl backdrop-blur-md sm:bottom-2 sm:start-4 sm:p-4">
              <p className="text-sm font-bold text-foreground sm:text-base">
                ★ 4.9 <span className="text-xs font-normal text-muted-foreground">(2,400+ reviews)</span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                Authentic Mediterranean & Middle Eastern Flavors
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
