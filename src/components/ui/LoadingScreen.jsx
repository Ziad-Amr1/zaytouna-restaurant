import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

function LoadingScreen({ className }) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-[60vh] items-center justify-center",
        className
      )}
    >
      <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default LoadingScreen;