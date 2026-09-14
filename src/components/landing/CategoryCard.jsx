import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

function CategoryCard({ icon: Icon, title, link, gradientClass }) {
  const { t } = useTranslation();

  return (
    <article className="group relative h-56 overflow-hidden rounded-2xl shadow-sm sm:h-64">
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-linear-to-br transition-transform duration-500 ease-out group-hover:scale-105",
          gradientClass,
        )}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"
      />

      <div className="absolute inset-x-0 top-0 flex justify-end p-4">
        <Icon
          className="size-16 text-white/25 transition-transform duration-500 group-hover:-translate-y-1"
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-xl font-semibold text-white">{title}</h3>

        <Link
          to={link}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 underline-offset-4 hover:text-white hover:underline"
        >
          {t("landing.categories.shopNow")}
          <ArrowRight
            className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:motion-safe:group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

export default CategoryCard;