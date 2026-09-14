import { useTranslation } from "react-i18next";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import AdminSidebarContent from "./AdminSidebarContent";

export default function AdminMobileSidebar({ open, onOpenChange }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isRTL ? "left" : "right"} className="w-72 p-4">
        <SheetHeader className="sr-only">
          <SheetTitle>{t("admin.navigationTitle")}</SheetTitle>

          <SheetDescription>
            {t("admin.navigationDescription")}
          </SheetDescription>
        </SheetHeader>

        <AdminSidebarContent compact onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
