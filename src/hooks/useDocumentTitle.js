import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useDocumentTitle(titleKey, defaultTitle = "Zaytouna Restaurant") {
  const { t } = useTranslation();

  useEffect(() => {
    if (titleKey) {
      const translated = t(titleKey);
      document.title = translated ? `${translated} | Zaytouna` : defaultTitle;
    } else {
      document.title = defaultTitle;
    }
  }, [titleKey, defaultTitle, t]);
}

export default useDocumentTitle;
