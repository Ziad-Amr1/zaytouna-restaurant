import { NavLink } from "react-router-dom";
import { Home, LogOut, PanelLeftClose, PanelLeftOpen, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";
import { cn, getUserAvatar } from "@/lib/utils";

import { Brand } from "../shared/Brand";
import { ADMIN_NAV } from "../shared/NavConfig";

export default function AdminNav({ onNavigate = () => {}, isCollapsed = false, onToggleCollapse }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const handleLogout = useLogout();

  const avatarUrl = getUserAvatar(user);

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <Brand subtitle={t("admin.sidebarSubtitle", "Management Hub")} />
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {ADMIN_NAV.map(({ to, labelKey, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              title={isCollapsed ? t(labelKey) : undefined}
              className={({ isActive }) =>
                cn(
                  "group relative flex h-10 items-center rounded-xl text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center px-0" : "gap-3 px-3",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute start-0 top-2 bottom-2 w-1 rounded-r-full bg-primary-foreground" />
                  )}
                  <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                  {!isCollapsed && <span className="truncate">{t(labelKey)}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-border/60 p-3 space-y-2">
        <NavLink
          to="/"
          onClick={onNavigate}
          title={isCollapsed ? t("admin.backToWebsite", "Back to Website") : undefined}
          className={({ isActive }) =>
            cn(
              "group flex h-10 items-center rounded-xl text-sm font-medium transition-colors",
              isCollapsed ? "justify-center px-0" : "gap-3 px-3",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )
          }
        >
          <Home className="size-4.5 shrink-0" aria-hidden="true" />
          {!isCollapsed && <span className="truncate">{t("admin.backToWebsite", "Back to Website")}</span>}
        </NavLink>

        <div
          className={cn(
            "flex items-center gap-3 rounded-xl bg-muted/40 p-2.5 transition-all",
            isCollapsed && "justify-center px-1"
          )}
          title={isCollapsed ? `${user?.name} (${user?.role})` : undefined}
        >
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-bold text-primary">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user?.name} className="size-full object-cover" />
            ) : user?.name ? (
              user.name.slice(0, 2).toUpperCase()
            ) : (
              "AD"
            )}
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1 text-start">
              <p className="truncate text-xs font-bold text-foreground">
                {user?.name || t("admin.defaultUser", "Administrator")}
              </p>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                <ShieldCheck className="size-3" aria-hidden="true" />
                {user?.role || t("admin.defaultRole", "admin")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-1 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onNavigate();
              handleLogout();
            }}
            title={isCollapsed ? t("admin.signOut", "Sign Out") : undefined}
            className={cn(
              "h-9 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive",
              isCollapsed ? "w-full justify-center px-0" : "flex-1 justify-start gap-2"
            )}
          >
            <LogOut className="size-4" aria-hidden="true" />
            {!isCollapsed && <span>{t("admin.signOut", "Sign Out")}</span>}
          </Button>

          {onToggleCollapse && !isCollapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleCollapse}
              title="Collapse Sidebar"
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <PanelLeftClose className="size-4 rtl:rotate-180" />
            </Button>
          )}
        </div>

        {onToggleCollapse && isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            title="Expand Sidebar"
            className="w-full h-8 justify-center rounded-xl text-muted-foreground hover:text-foreground"
          >
            <PanelLeftOpen className="size-4 rtl:rotate-180" />
          </Button>
        )}
      </div>
    </div>
  );
}