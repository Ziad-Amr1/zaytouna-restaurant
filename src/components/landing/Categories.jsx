import {
  Cookie,
  CupSoda,
  Leaf,
  UtensilsCrossed,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import CategoryCard from "@/components/landing/CategoryCard";

/* NOTE: only tokens that exist in zaytouna-tokens.css are used below.
   brick-700/brick-950, olive-600, brass-900, stone-600/900 do NOT exist
   in the palette — the old gradients were rendering transparent. */
const CATEGORY_CARDS = [
  {
    key: "mainCourse",
    category: "Main Course",
    icon: UtensilsCrossed,
    gradientClass: "from-(--color-brick-600) to-(--color-olive-950)",
  },
  {
    key: "appetizer",
    category: "Appetizer",
    icon: Leaf,
    gradientClass: "from-(--color-olive-700) to-(--color-olive-950)",
  },
  {
    key: "dessert",
    category: "Dessert",
    icon: Cookie,
    gradientClass: "from-(--color-brass-700) to-(--color-brick-600)",
  },
  {
    key: "beverage",
    category: "Beverage",
    icon: CupSoda,
    gradientClass: "from-(--color-olive-500) to-(--color-olive-900)",
  },
];

function Categories() {
  const { t } = useTranslation();

  return (
    /* no <section>/header here — Landing's SectionHeader owns the title.
       no mt-16 — the SECTION wrapper owns spacing. */
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
  );
}

export default Categories;
