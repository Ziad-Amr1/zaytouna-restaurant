import { Button } from "@/components/ui/button";
import ReservationModal from "@/components/common/ReservationModal";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="border-b bg-muted/40">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-2 md:items-center md:gap-12 md:py-16 lg:px-8">
        {/* Content */}
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
            {t("landing.tagline")}
          </p>

          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-[1.08] text-foreground sm:text-4xl md:text-5xl">
            {t("landing.title")}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {t("landing.description")}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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
        <div
          className="relative mx-auto w-full max-w-md md:max-w-none"
          aria-hidden="true"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-linear-to-b from-muted to-muted/40">
            {/* <img
              src="/hero.jpg"
              alt=""
              className="size-full object-cover"
            /> */}
          </div>

          <div className="absolute -bottom-3 start-3 rounded-xl border bg-background px-3 py-2 shadow-lg sm:-bottom-4 sm:start-4 sm:px-4 sm:py-3">
            <p className="text-sm font-semibold text-foreground">
              ★ 4.9
            </p>

            <p className="text-[11px] text-muted-foreground sm:text-xs">
              2,400+ reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
