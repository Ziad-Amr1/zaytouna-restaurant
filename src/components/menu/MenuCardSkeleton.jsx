import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function MenuCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-16" />
        </div>

        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="mt-auto h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export default MenuCardSkeleton;