import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  CartBadgeButton,
  LanguageSwitcher,
  ThemeButton,
} from "./NavbarActions";
import { getAdminLink, getMobileLinkClass } from "./NavbarNavigation";
// import { cn } from "@/lib/utils";

export function NavbarMobile({
  t,
  user,
  isAuthenticated,
  publicLinks,
  userLinks,
  theme,
  toggleTheme,
  handleLogout,
  mobileOpen,
  setMobileOpen,
  isRTL,
}) {
  function closeMobileMenu() {
    setMobileOpen(false);
  }

  const adminLink = getAdminLink(t);

  function renderLink(link) {
    const Icon = link.icon;

    return (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.to === "/"}
        className={getMobileLinkClass}
        onClick={closeMobileMenu}
      >
        <Icon className="size-5 shrink-0" aria-hidden="true" />

        <span>{link.label}</span>
      </NavLink>
    );
  }

  return (
    <div className="flex items-center gap-1 md:hidden">
      <CartBadgeButton />

      <LanguageSwitcher />

      <ThemeButton theme={theme} toggleTheme={toggleTheme} />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t("nav.openMenu")}>
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent
          side={isRTL ? "left" : "right"}
          className="w-[80vw] p-4 sm:max-w-sm"
        >
          {/* Mobile sidebar header */}
          <SheetHeader className="border-b border-border pb-4">
            <div className="flex items-center gap-3 text-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                Z
              </div>

              <div className="min-w-0">
                <SheetTitle className="text-base font-bold">
                  Zaytouna
                </SheetTitle>

                <p className="text-xs font-medium text-muted-foreground">
                  {t("footer.tagline")}
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <div className="mt-4 flex flex-col gap-1">
            {publicLinks.map(renderLink)}

            {isAuthenticated && userLinks.map(renderLink)}

            {user?.role === "admin" && (
              <NavLink
                to={adminLink.to}
                className={getMobileLinkClass}
                onClick={closeMobileMenu}
              >
                <adminLink.icon
                  className="size-5 shrink-0"
                  aria-hidden="true"
                />

                <span>{adminLink.label}</span>
              </NavLink>
            )}
          </div>

          {/* Account actions */}
          <SheetFooter className="mt-auto border-t border-border pt-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start"
                >
                  <Link to="/profile" onClick={closeMobileMenu}>
                    <User className="size-5" aria-hidden="true" />

                    <span>{user?.name || t("nav.profile")}</span>
                  </Link>
                </Button>

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="size-5" aria-hidden="true" />

                  <span>{t("nav.logout")}</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full">
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
  );
}
