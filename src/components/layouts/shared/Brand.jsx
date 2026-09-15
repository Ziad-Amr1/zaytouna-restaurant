import { cn } from "@/lib/utils";

/**
 * The "Z" mark + wordmark. Was hand-written in AdminSidebarContent and again
 * in NavbarMobile with slightly different sizes.
 */
export function Brand({ subtitle, className }) {
  return (
    <div className={cn("flex items-center gap-3 text-start", className)}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
        Z
      </div>

      <div className="min-w-0">
        <p className="text-base font-bold tracking-tight text-foreground">
          Zaytouna
        </p>

        {subtitle && (
          <p className="truncate text-xs font-medium text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
