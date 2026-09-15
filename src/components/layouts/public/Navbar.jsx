import { Link, NavLink } from "react-router-dom";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";
import { cn, getUserAvatar } from "@/lib/utils";

import { Brand } from "../shared/Brand";
import { navRowClass } from "../shared/NavRowClass";
import {
  CartBadgeButton,
  LanguageSwitcher,
  ThemeButton,
} from "../shared/AppActions";
import { NavDrawer } from "../shared/NavDrawer";
import { getNavLinks } from "../shared/NavConfig";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const desktopLinks = getNavLinks(isAuthenticated, user?.role);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="me-auto text-xl font-bold tracking-tight text-foreground"
        >
          Zaytouna
        </Link>

        <div className="me-4 hidden items-center gap-6 md:flex">
          {desktopLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )
              }
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </div>

        <CartBadgeButton />
        <LanguageSwitcher />
        <ThemeButton />

        <div className="hidden md:flex md:items-center md:gap-2">
          <AccountMenu />
        </div>

        <MobileMenu className="md:hidden" />
      </nav>
    </header>
  );
}

function AccountMenu() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const handleLogout = useLogout();

  if (!isAuthenticated) {
    return (
      <>
        <Button variant="ghost" asChild>
          <Link to="/login">{t("nav.login")}</Link>
        </Button>

        <Button asChild>
          <Link to="/register">{t("nav.signup")}</Link>
        </Button>
      </>
    );
  }

  const avatarUrl = getUserAvatar(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-full border-border bg-background/70 px-2.5 shadow-2xs hover:bg-accent transition-all focus-visible:ring-2"
          aria-label={t("nav.accountMenu")}
        >
          <Avatar className="size-6 shrink-0">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={user?.name} className="object-cover" />
            ) : null}
            <AvatarFallback className="text-[10px] font-bold bg-primary text-primary-foreground">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <span className="max-w-[120px] truncate text-xs font-semibold text-foreground">
            {user?.name}
          </span>
          <ChevronDown className="size-3 text-muted-foreground opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {user?.name}

          <span className="block text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/profile">
            <User aria-hidden="true" />
            {t("nav.profile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut aria-hidden="true" />
          {t("nav.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({ className }) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const handleLogout = useLogout();

  const links = getNavLinks(isAuthenticated, user?.role);

  return (
    <NavDrawer
      className={className}
      triggerLabel={t("nav.openMenu")}
      title={t("nav.menu")}
    >
      {({ close }) => (
        <>
          <Brand
            subtitle={t("footer.tagline")}
            className="border-b border-border pb-4"
          />

          <div className="mt-4 flex flex-col gap-1">
            {links.map(({ to, labelKey, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={close}
                className={navRowClass}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                <span>{t(labelKey)}</span>
              </NavLink>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline" asChild className="justify-start">
                  <Link to="/profile" onClick={close}>
                    <User className="size-5" aria-hidden="true" />
                    <span>{user?.name || t("nav.profile")}</span>
                  </Link>
                </Button>

                <Button
                  variant="destructive"
                  className="justify-start"
                  onClick={() => {
                    close();
                    handleLogout();
                  }}
                >
                  <LogOut className="size-5" aria-hidden="true" />
                  <span>{t("nav.logout")}</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={close}>
                    {t("nav.login")}
                  </Link>
                </Button>

                <Button asChild>
                  <Link to="/register" onClick={close}>
                    {t("nav.signup")}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </NavDrawer>
  );
}
