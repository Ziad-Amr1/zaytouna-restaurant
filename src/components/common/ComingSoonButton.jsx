import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

function ComingSoonButton({ variant = "outline", size = "default", className, children }) {
  const { t } = useTranslation();

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} size={size} disabled className={className}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{t("common.comingSoon")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ComingSoonButton;