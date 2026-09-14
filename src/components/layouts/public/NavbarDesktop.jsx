import { Link, NavLink } from "react-router-dom";
import { LogOut, User } from "lucide-react";
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
  CartBadgeButton,
  LanguageSwitcher,
  ThemeButton,
} from "./NavbarActions";
import { getDesktopLinkClass } from "./NavbarNavigation";

export function NavbarDesktop({
  t,
  user,
  isAuthenticated,
  publicLinks,
  userLinks,
  theme,
  toggleTheme,
  handleLogout,
}) {
  return (
    <div className="hidden items-center gap-8 md:flex">
      <div className="flex items-center gap-8">
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

      <div className="flex items-center gap-2">
        <CartBadgeButton />

        <ThemeButton theme={theme} toggleTheme={toggleTheme} />

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
    </div>
  );
}
