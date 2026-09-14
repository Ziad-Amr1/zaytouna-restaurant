import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-foreground">Zaytouna</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Levantine table, Cairo kitchen.
            </p>
          </div>

          <nav aria-label="Explore">
            <p className="text-sm font-medium text-foreground">Explore</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
                >
                  Menu
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-sm font-medium text-foreground">Visiting us</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                Open 12pm – 1am
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                Maadi, Cairo
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Zaytouna. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;