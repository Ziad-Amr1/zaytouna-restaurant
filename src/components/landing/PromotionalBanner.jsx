import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

function PromotionalBanner() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="promo-banner-title"
      className="relative overflow-hidden rounded-2xl bg-linear-to-br from-(--color-olive-950) to-(--color-olive-900) text-white shadow-lg ring-1 ring-black/10"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Flame className="absolute -end-8 -top-8 size-48 rotate-12 text-white/10" />
        <Flame className="absolute -bottom-10 start-8 size-40 -rotate-12 text-white/5" />
      </div>

      <div className="relative flex min-h-56 flex-col justify-center p-6 sm:min-h-64 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          {t("landing.banner.label")}
        </p>

        <h2
          id="promo-banner-title"
          className="mt-2 max-w-xl text-2xl font-bold tracking-tight md:text-3xl"
        >
          {t("landing.banner.headline")}
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-white/80 md:text-base">
          {t("landing.banner.description")}
        </p>

        <Button
          asChild
          size="lg"
          className="mt-6 w-fit bg-white font-semibold text-(--color-olive-950) shadow-md hover:bg-white/90"
        >
          <Link to="/menu">
            {t("landing.banner.cta")}
            <ArrowRight
              className="size-4 rtl:-scale-x-100"
              aria-hidden="true"
            />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default PromotionalBanner;
