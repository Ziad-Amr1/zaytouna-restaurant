import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
      <FileQuestion className="size-12 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t("notFound.title")}
      </h1>
      <p className="max-w-md text-muted-foreground">
        {t("notFound.description")}
      </p>
      <Button asChild>
        <Link to="/">{t("notFound.backHome")}</Link>
      </Button>
    </main>
  );
}

export default NotFoundPage;