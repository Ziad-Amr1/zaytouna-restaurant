import { RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function PageHeader({ title, description, onRefresh, action, className = "" }) {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center ${className}`}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {action}
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCcw className="mr-2 size-4" aria-hidden="true" />
            {t("common.retry", "Retry")}
          </Button>
        )}
      </div>
    </div>
  );
}
