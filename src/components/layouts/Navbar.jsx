import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  Heart,
  LogOut,
  Menu as MenuIcon,
  Moon,
  Sun,
  User,
} from "lucide-react";

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
import useTheme from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
];

const userLinks = [
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/orders", label: "My Orders", icon: ClipboardList },
  { to: "/reservations", label: "Reservations", icon: CalendarDays },
];

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const desktopLinkClass = ({ isActive }) =>
    cn(
      "text-sm font-medium transition-colors hover:text-foreground",
      isActive ? "text-foreground" : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
          Zaytouna
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={desktopLinkClass}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated &&
            userLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={desktopLinkClass}>
                {link.label}
              </NavLink>
            ))}

          {user?.role === "admin" && (
            <NavLink to="/admin" className={desktopLinkClass}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Account menu"
                >
                  <Avatar>
                    <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">{user?.name}</span>
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

                <DropdownMenuItem asChild>
                  <Link to="/favorites">
                    <Heart /> Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">
                    <ClipboardList /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/reservations">
                    <CalendarDays /> Reservations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User /> Profile
                  </Link>
                </DropdownMenuItem>

                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin</Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center md:hidden">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:max-w-sm">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>

              <div className="flex flex-col gap-1 px-4 pt-2">
                {publicLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                        isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                      )
                    }
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}

                {isAuthenticated &&
                  userLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                          isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                        )
                      }
                      onClick={() => setOpen(false)}
                    >
                      <link.icon /> {link.label}
                    </NavLink>
                  ))}

                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                        isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                      )
                    }
                    onClick={() => setOpen(false)}
                  >
                    Admin
                  </NavLink>
                )}
              </div>

              <SheetFooter>
                {isAuthenticated ? (
                  <>
                    <Button variant="outline" asChild className="w-full justify-start">
                      <Link to="/profile" onClick={() => setOpen(false)}>
                        <User /> {user?.name || "Profile"}
                      </Link>
                    </Button>
                    <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                      <LogOut /> Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login" onClick={() => setOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/register" onClick={() => setOpen(false)}>
                        Sign up
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