import { useState } from "react";
import { ShieldAlert } from "lucide-react";

import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);

  const toggleRole = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, role: user.role === "admin" ? "user" : "admin" }
          : user
      )
    );
  };

  const columns = [
    { header: "User ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email Address", accessor: "email" },
    {
      header: "Role (RBAC)",
      accessor: "role",
      render: (row) => (
        <Badge
          className={
            row.role === "admin"
              ? "border-purple-500/20 bg-purple-500/10 text-purple-700"
              : "bg-muted text-muted-foreground"
          }
        >
          {row.role?.toUpperCase()}
        </Badge>
      ),
    },
    { header: "Registered Date", accessor: "joined" },
    { header: "Last Session", accessor: "lastLogin" },
    {
      header: "RBAC Switch",
      accessor: "id",
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => toggleRole(row.id)}>
          Make {row.role === "admin" ? "User" : "Admin"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Users &amp; RBAC Control
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage registered customers and staff permissions (Admin vs User).
          </p>
        </div>
      </div>

      <div
        role="status"
        className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300"
      >
        <ShieldAlert size={20} className="flex-shrink-0 text-amber-600" aria-hidden="true" />
        <p>
          <strong>RBAC Active:</strong> Roles dictate page privileges across the application.
          Only users with the <strong>ADMIN</strong> role can access this dashboard.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        emptyMessage="No registered users found in the system."
      />
    </div>
  );
}
