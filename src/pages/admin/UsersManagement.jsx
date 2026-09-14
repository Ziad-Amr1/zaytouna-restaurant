import { ShieldOff } from "lucide-react";

export default function UsersManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Users &amp; Roles</h2>
        <p className="text-sm text-muted-foreground">
          Manage registered customers, staff roles, and access permissions.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <ShieldOff size={26} aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">User management is temporarily disabled</h3>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Listing users and editing roles requires dedicated backend endpoints
              (GET /users, PATCH /users/:id/role) that are not part of this backend
              iteration. This panel is reserved for those operations.
            </p>
          </div>
          <div className="w-full max-w-md space-y-2 rounded-xl border border-border bg-muted/30 p-4 text-left text-xs text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Currently in effect:</span> new
              registrations are always created with the &quot;user&quot; role, and the seeded
              admin account (admin@techmaster.com) is provisioned at backend startup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}