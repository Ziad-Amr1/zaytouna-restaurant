import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackLink({ label = "Back to homepage", className }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const from = location.state?.from || "/";
    navigate(from);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <ArrowLeft className="size-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
      {label}
    </button>
  );
}