import safeStorage from "./storage";

const INITIAL_USERS = [
  {
    id: "admin-001",
    name: "Admin User",
    email: "admin@techmaster.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "user-002",
    name: "Sarah Ahmed",
    email: "user@techmaster.com",
    role: "user",
    status: "active",
    createdAt: "2024-02-10T12:30:00.000Z",
  },
  {
    id: "staff-003",
    name: "Karim Hassan",
    email: "staff@techmaster.com",
    role: "staff",
    status: "active",
    createdAt: "2024-03-05T09:15:00.000Z",
  },
  {
    id: "chef-004",
    name: "Chef Omar Zaki",
    email: "chef@techmaster.com",
    role: "staff",
    status: "active",
    createdAt: "2024-03-12T14:20:00.000Z",
  },
  {
    id: "user-005",
    name: "Youssef Ali",
    email: "youssef@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-04-01T18:45:00.000Z",
  },
  {
    id: "user-006",
    name: "Noha Mahmoud",
    email: "noha@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-05-15T11:20:00.000Z",
  },
  {
    id: "user-007",
    name: "Tarek Mansour",
    email: "tarek@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-06-20T16:10:00.000Z",
  },
  {
    id: "admin-008",
    name: "Mona Ibrahim",
    email: "manager@techmaster.com",
    role: "admin",
    status: "active",
    createdAt: "2024-07-01T08:00:00.000Z",
  },
];

export function getUsers() {
  const stored = safeStorage.get("zaytouna_users");
  if (!stored) {
    safeStorage.set("zaytouna_users", JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_USERS;
  }
}

export function updateUserRole(userId, newRole) {
  const users = getUsers();
  const updated = users.map((u) =>
    u.id === userId ? { ...u, role: newRole } : u
  );
  safeStorage.set("zaytouna_users", JSON.stringify(updated));
  window.dispatchEvent(new Event("users:change"));
  return updated;
}

export function updateUserStatus(userId, newStatus) {
  const users = getUsers();
  const updated = users.map((u) =>
    u.id === userId ? { ...u, status: newStatus } : u
  );
  safeStorage.set("zaytouna_users", JSON.stringify(updated));
  window.dispatchEvent(new Event("users:change"));
  return updated;
}
