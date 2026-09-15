import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

function UnauthorizedPage() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
      <ShieldAlert className="size-12 text-destructive" aria-hidden="true" />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t("unauthorized.title")}
      </h1>
      <p className="max-w-md text-muted-foreground">
        {t("unauthorized.description")}
      </p>
      <Button asChild>
        <Link to="/">{t("unauthorized.backHome")}</Link>
      </Button>
    </main>
  );
}

export default UnauthorizedPage;