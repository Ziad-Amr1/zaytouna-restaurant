import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FOOTER_NAV } from "../shared/NavConfig";

const VISITING = [
  { icon: Clock, key: "footer.hours" },
  { icon: MapPin, key: "footer.location" },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-foreground">Zaytouna</p>

            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>

          <nav aria-label={t("footer.exploreLabel")}>
            <p className="text-sm font-medium text-foreground">
              {t("footer.explore")}
            </p>

            <ul className="mt-3 space-y-2">
              {FOOTER_NAV.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-medium text-foreground">
              {t("footer.visiting")}
            </p>

            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {VISITING.map(({ icon: Icon, key }) => (
                <li key={key} className="flex items-start gap-2">
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-foreground"
                    aria-hidden="true"
                  />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-xs text-muted-foreground">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
