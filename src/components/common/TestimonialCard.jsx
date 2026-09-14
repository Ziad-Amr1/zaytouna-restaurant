import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

function TestimonialCard({ name, role, quote, rating = 5 }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex gap-0.5 text-foreground" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`size-4 ${i < rating ? "fill-current" : "opacity-25"}`} />
          ))}
        </div>

        <p className="flex-1 text-lg leading-relaxed text-foreground">“{quote}”</p>

        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          {role && <p className="text-xs text-muted-foreground">{role}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default TestimonialCard;