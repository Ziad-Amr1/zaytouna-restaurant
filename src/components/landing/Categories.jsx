import { Link } from "react-router-dom";
import { ArrowRight, Cookie, CupSoda, Leaf, UtensilsCrossed } from "lucide-react";
import { useTranslation } from "react-i18next";

import CategoryCard from "@/components/landing/CategoryCard";

const CATEGORY_CARDS = [
  {
    key: "mainCourse",
    category: "Main Course",
    icon: UtensilsCrossed,
    gradientClass: "from-(--color-brick-700) to-(--color-brick-950)",
  },
  {
    key: "appetizer",
    category: "Appetizer",
    icon: Leaf,
    gradientClass: "from-(--color-olive-600) to-(--color-olive-900)",
  },
  {
    key: "dessert",
    category: "Dessert",
    icon: Cookie,
    gradientClass: "from-(--color-brass-600) to-(--color-brass-900)",
  },
  {
    key: "beverage",
    category: "Beverage",
    icon: CupSoda,
    gradientClass: "from-(--color-stone-600) to-(--color-stone-900)",
  },
];

function Categories() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="categories-title" className="mt-16">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2
          id="categories-title"
          className="text-2xl font-bold text-foreground sm:text-3xl"
        >
          {t("landing.categories.title")}
        </h2>

        <Link
          to="/menu"
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:text-accent-strong hover:underline"
        >
          {t("landing.categories.viewAll")}
          <ArrowRight
            className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:motion-safe:group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </header>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORY_CARDS.map((card) => {
          const Icon = card.icon;

          return (
            <li key={card.key}>
              <CategoryCard
                icon={Icon}
                title={t(`menuCategories.${card.key}`)}
                link={{
                  pathname: "/menu",
                  search: `?category=${encodeURIComponent(card.category)}`,
                }}
                gradientClass={card.gradientClass}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Categories;