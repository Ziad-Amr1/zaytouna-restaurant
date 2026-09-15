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
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    gradientClass: "from-amber-700 to-amber-950",
  },
  {
    key: "appetizer",
    category: "Appetizer",
    icon: Leaf,
    imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80",
    gradientClass: "from-emerald-700 to-emerald-950",
  },
  {
    key: "dessert",
    category: "Dessert",
    icon: Cookie,
    imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
    gradientClass: "from-orange-700 to-red-950",
  },
  {
    key: "beverage",
    category: "Beverage",
    icon: CupSoda,
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    gradientClass: "from-teal-700 to-cyan-950",
  },
];

function Categories() {
  const { t } = useTranslation();

  return (
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
              imageUrl={card.imageUrl}
              gradientClass={card.gradientClass}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default Categories;
