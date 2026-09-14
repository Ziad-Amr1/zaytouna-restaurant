import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Check,
  ClipboardList,
  Heart,
  Languages,
  LogOut,
  Menu,
  Moon,
  ShoppingCart,
  Sun,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import useTheme from "@/hooks/useTheme";
import { supportedLanguages, setLanguage } from "@/i18n";
import { formatItemCount } from "@/lib/cart";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS = {
  en: "English",
  ar: "العربية",
  fr: "Français",
};

function CartBadgeButton({ className }) {
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

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Language"
        >
          <Languages className="size-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
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

function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const publicLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/menu", label: t("nav.menu") },
  ];

  const userLinks = [
    { to: "/favorites", label: t("nav.favorites"), icon: Heart },
    { to: "/orders", label: t("nav.orders"), icon: ClipboardList },
    { to: "/reservations", label: t("nav.reservations"), icon: CalendarDays },
  ];

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function handleLogout() {
    logout();
    closeMobileMenu();
    navigate("/");
  }

  function getDesktopLinkClass({ isActive }) {
    return cn(
      "text-sm font-medium transition-colors hover:text-foreground",
      isActive ? "text-foreground" : "text-muted-foreground",
    );
  }

  function getMobileLinkClass({ isActive }) {
    return cn(
      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
      "hover:bg-accent",
      isActive ? "bg-accent text-accent-foreground" : "text-foreground",
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          Zaytouna
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={getDesktopLinkClass}
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated &&
            userLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={getDesktopLinkClass}
              >
                {link.label}
              </NavLink>
            ))}

          {user?.role === "admin" && (
            <NavLink to="/admin" className={getDesktopLinkClass}>
              {t("nav.admin")}
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <CartBadgeButton />

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

          <LanguageSwitcher />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={t("nav.accountMenu")}
                >
                  <Avatar>
                    <AvatarFallback>
                      {user?.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-sm font-medium text-foreground">
                    {user?.name}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user?.name}
                  <span className="block text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {userLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <DropdownMenuItem key={link.to} asChild>
                      <Link to={link.to}>
                        <Icon />
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User />
                    {t("nav.profile")}
                  </Link>
                </DropdownMenuItem>

                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">{t("nav.admin")}</Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                >
                  <LogOut />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">{t("nav.login")}</Link>
              </Button>

              <Button asChild>
                <Link to="/register">{t("nav.signup")}</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center md:hidden">
          <CartBadgeButton />

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

          <LanguageSwitcher />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("nav.openMenu")}
              >
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[80vw] sm:max-w-sm">
              <SheetTitle className="sr-only">
                {t("nav.navigationMenu")}
              </SheetTitle>

              <div className="flex flex-col gap-1 px-4 pt-2">
                {publicLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={getMobileLinkClass}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </NavLink>
                ))}

                {isAuthenticated &&
                  userLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={cn(
                          getMobileLinkClass,
                          "flex items-center gap-2",
                        )}
                        onClick={closeMobileMenu}
                      >
                        <Icon />
                        {link.label}
                      </NavLink>
                    );
                  })}

                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={getMobileLinkClass}
                    onClick={closeMobileMenu}
                  >
                    {t("nav.admin")}
                  </NavLink>
                )}
              </div>

              <SheetFooter>
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link to="/profile" onClick={closeMobileMenu}>
                        <User />
                        {user?.name || t("nav.profile")}
                      </Link>
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut />
                      {t("nav.logout")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full"
                    >
                      <Link to="/login" onClick={closeMobileMenu}>
                        {t("nav.login")}
                      </Link>
                    </Button>

                    <Button asChild className="w-full">
                      <Link to="/register" onClick={closeMobileMenu}>
                        {t("nav.signup")}
                      </Link>
                    </Button>
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;