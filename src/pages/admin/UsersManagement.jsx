import { useEffect, useMemo, useState } from "react";
import {
  Check,
  KeyRound,
  Pencil,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getUsers, updateUserRole, updateUserStatus } from "@/lib/users";
import safeStorage from "@/lib/storage";
import PageHeader from "@/components/common/PageHeader";

function UserFormDialog({ open, onOpenChange, user, onSaved }) {
  const editing = Boolean(user?.id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState("active");
  const [password, setPassword] = useState("password123");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "user");
      setStatus(user.status || "active");
    } else {
      setName("");
      setEmail("");
      setRole("user");
      setStatus("active");
      setPassword("password123");
    }
  }, [user, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required");
      return;
    }

    const currentUsers = getUsers();
    let updated;
    if (editing) {
      updated = currentUsers.map((u) =>
        u.id === user.id ? { ...u, name, email, role, status } : u
      );
      toast.success("User updated successfully");
    } else {
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        status,
        createdAt: new Date().toISOString(),
      };
      updated = [newUser, ...currentUsers];
      toast.success("New user created successfully");
    }

    safeStorage.set("zaytouna_users", JSON.stringify(updated));
    window.dispatchEvent(new Event("users:change"));
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit User Account" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {editing ? "Modify user details, role, and status." : "Create a new user account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-name">Full Name</Label>
            <Input
              id="user-name"
              placeholder="e.g. Sarah Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email">Email Address</Label>
            <Input
              id="user-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!editing && (
            <div className="space-y-2">
              <Label htmlFor="user-password">Initial Password</Label>
              <Input
                id="user-password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="user">User (Customer)</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editing ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState(getUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    function handleChange() {
      setUsers(getUsers());
    }
    window.addEventListener("users:change", handleChange);
    return () => window.removeEventListener("users:change", handleChange);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const staff = users.filter((u) => u.role === "staff").length;
    const active = users.filter((u) => u.status === "active").length;
    return { total, admins, staff, active };
  }, [users]);

  const handleRoleChange = (userId, newRole) => {
    try {
      updateUserRole(userId, newRole);
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update user role");
    }
  };

  const handleStatusToggle = (userId, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      updateUserStatus(userId, nextStatus);
      toast.success(`Status updated to ${nextStatus}`);
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = (userId, userName) => {
    const updated = users.filter((u) => u.id !== userId);
    safeStorage.set("zaytouna_users", JSON.stringify(updated));
    window.dispatchEvent(new Event("users:change"));
    toast.success(`User "${userName}" was removed`);
  };

  const handleResetPassword = (email) => {
    toast.success(`Password reset email sent to ${email} (Default: password123)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title={t("admin.users.title", "Users & Roles")}
          subtitle={t("admin.users.subtitle", "Manage customer accounts, staff roles, and access permissions.")}
        />

        <Button
          className="rounded-xl px-4 text-sm gap-2"
          onClick={() => {
            setEditingUser(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          <span>Add New User</span>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Accounts</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Administrators</p>
              <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <UserCog className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Staff Members</p>
              <p className="text-2xl font-bold text-foreground">{stats.staff}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <UserCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="user">User (Customer)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
              <tr>
                <th className="px-6 py-3.5 text-start">User</th>
                <th className="px-6 py-3.5 text-start">Role</th>
                <th className="px-6 py-3.5 text-start">Status</th>
                <th className="px-6 py-3.5 text-start">Joined Date</th>
                <th className="px-6 py-3.5 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No users matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                            {u.role === "admin" && <Shield className="size-3.5 text-amber-500" />}
                            {u.role === "staff" && <UserCog className="size-3.5 text-blue-500" />}
                            {u.role === "user" && <Users className="size-3.5 text-muted-foreground" />}
                            <span className="capitalize">{u.role}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-36">
                          <DropdownMenuItem onClick={() => handleRoleChange(u.id, "admin")} className="justify-between">
                            <span>Admin</span>
                            {u.role === "admin" && <Check className="size-4" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(u.id, "staff")} className="justify-between">
                            <span>Staff</span>
                            {u.role === "staff" && <Check className="size-4" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(u.id, "user")} className="justify-between">
                            <span>User</span>
                            {u.role === "user" && <Check className="size-4" />}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(u.id, u.status)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-opacity hover:opacity-80 ${
                          u.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20"
                            : "bg-destructive/10 text-destructive dark:bg-destructive/20"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            u.status === "active" ? "bg-emerald-500" : "bg-destructive"
                          }`}
                        />
                        {u.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Edit User"
                          onClick={() => {
                            setEditingUser(u);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Reset Password"
                          onClick={() => handleResetPassword(u.email)}
                        >
                          <KeyRound className="size-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>

                        {u.role !== "admin" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon-sm" title="Delete User">
                                <Trash2 className="size-3.5 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User &quot;{u.name}&quot;?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action permanently removes this account.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSaved={() => setUsers(getUsers())}
      />
    </div>
  );
}