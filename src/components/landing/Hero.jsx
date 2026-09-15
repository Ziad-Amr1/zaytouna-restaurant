import { Button } from "@/components/ui/button";
import ReservationModal from "@/components/common/ReservationModal";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center border-b bg-muted/30 py-8 lg:py-0">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center md:gap-12 lg:px-8">
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
    </section>
  );
}
