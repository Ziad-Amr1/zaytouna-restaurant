import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";

import AdminSidebar, { SidebarContent } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useTheme from "@/hooks/useTheme";

export default function AdminLayout() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-8">
          <span className="text-sm font-bold text-foreground md:hidden">Zaytouna Admin</span>

          <div className="flex items-center gap-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open admin menu"
                  className="rounded-xl text-muted-foreground hover:bg-muted md:hidden"
                >
                  <Menu size={20} aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Admin navigation</SheetTitle>
                  <SheetDescription>Navigate the admin console sections.</SheetDescription>
                </SheetHeader>
                <SidebarContent onNavigate={() => setSheetOpen(false)} compact />
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-xl text-muted-foreground hover:bg-muted"
            >
              {theme === "dark" ? (
                <Sun size={20} aria-hidden="true" />
              ) : (
                <Moon size={20} aria-hidden="true" />
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
