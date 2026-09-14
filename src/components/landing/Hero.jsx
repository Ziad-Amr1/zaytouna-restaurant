import { Button } from "@/components/ui/button";
import ReservationModal from "@/components/common/ReservationModal";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="flex min-h-svh items-center border-b bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-accent-strong uppercase">
            {t("landing.tagline")}
          </p>
          <h1 className="mt-3 text-4xl leading-tight font-bold text-foreground sm:text-5xl">
            {t("landing.title")}
          </h1>
          <p className="mt-5 max-w-md text-muted-foreground">
            {t("landing.description")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
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
            <a
              href="#featured"
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("landing.seeTonight")} ↓
            </a>
          </div>
        </div>

        <div className="relative" aria-hidden="true">
          <div className="aspect-[4/5] max-h-[70vh] overflow-hidden rounded-2xl bg-linear-to-b from-muted to-muted/40">
            {/* <img src="/hero.jpg" alt="" className="size-full object-cover" /> */}
          </div>
          <div className="absolute -bottom-4 -start-4 rounded-xl border bg-background px-4 py-3 shadow-lg sm:-start-6">
            <p className="text-sm font-semibold text-foreground">★ 4.9</p>
            <p className="text-xs text-muted-foreground">2,400+ reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
}
