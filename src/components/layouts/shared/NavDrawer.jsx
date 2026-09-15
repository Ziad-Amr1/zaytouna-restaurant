import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * The mobile drawer, owned in one place: trigger button, open state,
 * RTL-aware side, width, and the a11y title Radix requires.
 *
 * `children` is a function so the panel can close itself on navigate:
 *   <NavDrawer ...>{({ close }) => <Link onClick={close} />}</NavDrawer>
 */
export function NavDrawer({
  triggerLabel,
  title,
  description,
  children,
  className,
}) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={triggerLabel}
          className={cn(className)}
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-72 flex-col gap-0 p-4">
        <SheetHeader className="sr-only">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        {children({ close })}
      </SheetContent>
    </Sheet>
  );
}
