import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function MenuCard({ dish }) {
  return (
    <Card className="group overflow-hidden p-0">
      <Link to={`/menu/${dish.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {dish.image ? (
            <img
              src={dish.image}
              alt={dish.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              {dish.name}
            </div>
          )}

          {dish.available === false && (
            <Badge variant="secondary" className="absolute start-3 top-3">
              Sold out
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg leading-snug text-foreground">{dish.name}</h3>
            <span className="shrink-0 text-sm font-semibold text-foreground">
              EGP {dish.price}
            </span>
          </div>

          {dish.category && (
            <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
              {dish.category}
            </p>
          )}

          {dish.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{dish.description}</p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

export default MenuCard;