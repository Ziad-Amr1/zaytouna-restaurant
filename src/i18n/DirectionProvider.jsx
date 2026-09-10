import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function DirectionProvider({ children }) {
  const { i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [dir, i18n.language]);

  return children;
}