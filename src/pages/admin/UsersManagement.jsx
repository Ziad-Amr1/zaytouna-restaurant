import { useState } from "react";
import DataTable from "@/components/common/DataTable";
import {  ShieldAlert } from "lucide-react";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);

  const toggleRole = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, role: user.role === "admin" ? "user" : "admin" } : user
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
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
          row.role === "admin" 
            ? "border-purple-500/20 bg-purple-500/10 text-purple-700" 
            : "border-border bg-muted text-muted-foreground"
        }`}>
          {row.role?.toUpperCase()}
        </span>
      ),
    },
    { header: "Registered Date", accessor: "joined" },
    { header: "Last Session", accessor: "lastLogin" },
    {
      header: "RBAC Switch",
      accessor: "id",
      render: (row) => (
        <button
          onClick={() => toggleRole(row.id)}
          className="rounded-lg border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Make {row.role === "admin" ? "User" : "Admin"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Users & RBAC Control</h2>
          <p className="text-sm text-muted-foreground">Manage registered customers and staff permissions (Admin vs User).</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300">
        <ShieldAlert size={20} className="flex-shrink-0 text-amber-600" />
        <p><strong>RBAC Active:</strong> Roles dictate page privileges across the application. Only users with the <strong>ADMIN</strong> role can access this dashboard.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={users} 
        emptyMessage="No registered users found in the system."
      />
    </div>
  );
}