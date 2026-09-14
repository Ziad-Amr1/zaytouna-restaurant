import { Mail, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

import ComingSoonButton from "@/components/common/ComingSoonButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Newsletter() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="newsletter-title"
      className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-card px-6 py-8 md:flex-row md:px-8"
    >
      <div className="flex w-full items-center gap-4 md:w-1/2">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Mail className="size-7" aria-hidden="true" />
        </div>

        <div>
          <h2
            id="newsletter-title"
            className="text-lg font-semibold text-foreground"
          >
            {t("landing.newsletter.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("landing.newsletter.description")}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row md:w-1/2 md:justify-end">
        <div className="w-full sm:max-w-xs">
          <Label htmlFor="newsletter-email" className="sr-only">
            {t("landing.newsletter.emailLabel")}
          </Label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder={t("landing.newsletter.emailPlaceholder")}
            autoComplete="email"
          />
        </div>

        <ComingSoonButton>
          {t("landing.newsletter.subscribe")}
          <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </ComingSoonButton>
      </div>
    </section>
  );
}

export default Newsletter;