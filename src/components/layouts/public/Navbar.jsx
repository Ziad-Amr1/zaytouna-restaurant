import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";
import { getPublicLinks, getUserLinks } from "./NavbarNavigation";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isRTL = i18n.dir() === "rtl";

  const publicLinks = getPublicLinks(t);
  const userLinks = getUserLinks(t);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function handleLogout() {
    logout();
    closeMobileMenu();
    navigate("/");
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

        <NavbarDesktop
          t={t}
          user={user}
          isAuthenticated={isAuthenticated}
          publicLinks={publicLinks}
          userLinks={userLinks}
          theme={theme}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
        />

        <NavbarMobile
          t={t}
          user={user}
          isAuthenticated={isAuthenticated}
          publicLinks={publicLinks}
          userLinks={userLinks}
          theme={theme}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isRTL={isRTL}
        />
      </nav>
    </header>
  );
}
