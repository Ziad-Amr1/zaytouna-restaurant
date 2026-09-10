import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
      <ShieldAlert className="size-12 text-destructive" aria-hidden="true" />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Access denied
      </h1>
      <p className="max-w-md text-muted-foreground">
        You don&apos;t have permission to view this page. If you believe this is
        a mistake, please contact the restaurant administrator.
      </p>
      <Button asChild>
        <Link to="/">Back to homepage</Link>
      </Button>
    </main>
  );
}

export default UnauthorizedPage;