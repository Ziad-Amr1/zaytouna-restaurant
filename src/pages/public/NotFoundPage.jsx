import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
      <FileQuestion className="size-12 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button asChild>
        <Link to="/">Back to homepage</Link>
      </Button>
    </main>
  );
}

export default NotFoundPage;