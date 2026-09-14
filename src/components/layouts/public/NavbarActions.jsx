import { Link } from "react-router-dom";
import { Check, Languages, Moon, ShoppingCart, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCart from "@/hooks/useCart";
import { supportedLanguages, setLanguage } from "@/i18n";
import { formatItemCount } from "@/lib/cart";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS = {
  en: "English",
  ar: "العربية",
  fr: "Français",
};

export function CartBadgeButton({ className }) {
  const { t } = useTranslation();
  const { cart } = useCart();
  const itemCount = formatItemCount(cart.itemCount);

  return (
    <Button
      asChild
      type="button"
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      aria-label={t("nav.cart")}
    >
      <Link to="/cart">
        <ShoppingCart className="size-5" aria-hidden="true" />

        {itemCount && (
          <span className="pointer-events-none absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-strong px-1 text-[10px] font-bold text-foreground">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("nav.language")}
        >
          <Languages className="size-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>{t("nav.language")}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {supportedLanguages.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => void setLanguage(code)}
            className="justify-between"
          >
            {LANGUAGE_LABELS[code]}

            {i18n.language === code && (
              <Check className="size-4" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeButton({ theme, toggleTheme }) {
  const { t } = useTranslation();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? t("nav.themeToLight")
          : t("nav.themeToDark")
      }
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
