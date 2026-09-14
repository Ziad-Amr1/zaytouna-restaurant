import { FilterX, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function ActiveFiltersBar({
  resultsCount,
  applied,
  hasActiveFilters,
  clearCategory,
  clearSearch,
  clearFilters,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="pe-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("menu.results", { count: resultsCount })}
        </span>

        {applied.category && applied.category !== "all" && (
          <Badge variant="secondary" className="gap-1.5 py-1 ps-2.5 pe-1.5 text-xs font-medium">
            {t("menu.filterCategory")}{" "}
            <span className="font-semibold">{applied.category}</span>
            <button
              type="button"
              onClick={clearCategory}
              aria-label={t("menu.clearCategory", { category: applied.category })}
              className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </Badge>
        )}

        {applied.search && (
          <Badge variant="secondary" className="gap-1.5 py-1 ps-2.5 pe-1.5 text-xs font-medium">
            {t("menu.filterSearch")}{" "}
            <span className="font-semibold">"{applied.search}"</span>
            <button
              type="button"
              onClick={clearSearch}
              aria-label={t("menu.clearSearch")}
              className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </Badge>
        )}
      </div>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <FilterX className="size-3.5" aria-hidden="true" />
          {t("menu.clearFilters")}
        </Button>
      )}
    </div>
  );
}

export default ActiveFiltersBar;