import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

function CategoryCard({ icon: Icon, title, link, imageUrl, gradientClass }) {
  const { t } = useTranslation();

  return (
    <article className="group relative h-56 overflow-hidden rounded-2xl shadow-md sm:h-64 border border-border/50">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 bg-gradient-to-br transition-transform duration-500 ease-out group-hover:scale-105",
            gradientClass
          )}
        />
      )}

      {/* Dark gradient overlay for text readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/90"
      />

      <div className="absolute inset-x-0 top-0 flex justify-end p-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white transition-transform duration-300 group-hover:scale-110">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-xl font-bold text-white drop-shadow-xs">{title}</h3>

        <Link
          to={link}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors"
        >
          {t("landing.categories.shopNow")}
          <ArrowRight
            className="size-4 transition-transform motion-safe:group-hover:translate-x-1 rtl:-scale-x-100 rtl:motion-safe:group-hover:-translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

export default CategoryCard;