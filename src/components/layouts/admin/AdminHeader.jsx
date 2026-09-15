import { useTranslation } from "react-i18next";

import { LanguageSwitcher, ThemeButton } from "../shared/AppActions";
import { NavDrawer } from "../shared/NavDrawer";
import AdminNav from "./AdminNav";

export default function AdminHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/90 backdrop-blur-md px-4 md:px-8 shadow-2xs">
      <span className="text-sm font-bold text-foreground md:hidden">
        {t("admin.mobileTitle")}
      </span>

      <div className="ms-auto flex items-center gap-1.5">
        <LanguageSwitcher />

        <ThemeButton />

        <NavDrawer
          className="md:hidden"
          triggerLabel={t("admin.openMenu")}
          title={t("admin.navigationTitle")}
          description={t("admin.navigationDescription")}
        >
          {({ close }) => <AdminNav onNavigate={close} />}
        </NavDrawer>
      </div>
    </header>
  );
}
