import { NavLink } from "react-router-dom";
import { Home, LogOut, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";

import { Brand } from "../shared/Brand";
import { navRowClass } from "../shared/NavRowClass";
import { ADMIN_NAV } from "../shared/NavConfig";

/**
 * Used as-is in both the desktop sidebar and the mobile drawer.
 * The old `compact` prop only shaved 2–4px off paddings and icons — not worth
 * two sets of conditional class strings, so both render at the same size.
 */
export default function AdminNav({ onNavigate = () => {} }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const handleLogout = useLogout();

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div>
        <Brand
          subtitle={t("admin.brandSubtitle")}
          className="mb-4 border-b border-border px-3 py-4"
        />

        <nav aria-label={t("admin.navigationLabel")} className="space-y-1">
          {ADMIN_NAV.map(({ to, labelKey, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              className={navRowClass}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span>{t(labelKey)}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <NavLink to="/" onClick={onNavigate} className={navRowClass}>
          <Home className="size-5 shrink-0" aria-hidden="true" />
          <span>{t("admin.backToWebsite")}</span>
        </NavLink>

        <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
          </div>

          <div className="min-w-0 flex-1 text-start">
            <p className="truncate text-xs font-semibold text-foreground">
              {user?.name || t("admin.defaultUser")}
            </p>

            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <ShieldCheck className="size-3" aria-hidden="true" />
              {user?.role || t("admin.defaultRole")}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            onNavigate();
            handleLogout();
          }}
          className="w-full justify-start rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" aria-hidden="true" />
          <span>{t("admin.signOut")}</span>
        </Button>
      </div>
    </div>
  );
}