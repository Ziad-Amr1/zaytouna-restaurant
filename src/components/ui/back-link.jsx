import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackLink({ labelKey, className }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleBack = () => {
    const from = location.state?.from || "/";

    navigate(from);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm text-sm font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring)",
        className
      )}
    >
      <ArrowLeft className="size-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
      {t(labelKey)}
    </button>
  );
}