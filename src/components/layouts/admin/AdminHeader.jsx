import { useState } from "react";
import { Languages, Menu, Moon, Sun, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import AdminMobileSidebar from "./AdminMobileSidebar";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useTheme from "@/hooks/useTheme";
import { supportedLanguages, setLanguage } from "@/i18n";

const LANGUAGE_LABELS = {
  en: "English",
  ar: "العربية",
  fr: "Français",
};

export default function AdminHeader() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-8">
      <span className="text-sm font-bold text-foreground md:hidden">
        {t("admin.mobileTitle")}
      </span>

      <div className="flex items-center gap-1.5">
        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("nav.language")}
              className="rounded-xl text-muted-foreground hover:bg-muted"
            >
              <Languages size={19} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuLabel>{t("nav.language")}</DropdownMenuLabel>

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

        {/* Theme */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? t("nav.themeToLight") : t("nav.themeToDark")
          }
          className="rounded-xl text-muted-foreground hover:bg-muted"
        >
          {theme === "dark" ? (
            <Sun size={20} aria-hidden="true" />
          ) : (
            <Moon size={20} aria-hidden="true" />
          )}
        </Button>

        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label={t("admin.openMenu")}
          className="rounded-xl text-muted-foreground hover:bg-muted md:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </Button>

        <AdminMobileSidebar
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
        />
      </div>
    </header>
  );
}
