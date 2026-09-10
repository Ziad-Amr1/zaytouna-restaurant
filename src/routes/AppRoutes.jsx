import { Route, Routes } from "react-router-dom";

import { Button } from "@/components/ui/button";
import Login from "@/pages/auth/Login";
import Registration from "@/pages/auth/Registration";
import UnauthorizedPage from "@/pages/public/UnauthorizedPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleGuard from "@/routes/RoleGuard";

function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold">Zaytouna Restaurant</h1>

      <p className="text-muted-foreground">
        Foundation is ready — pages are coming soon.
      </p>

      <div className="flex gap-2">
        <Button>Get Started</Button>
        <Button variant="outline">View Menu</Button>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/menu" element={<div>Menu</div>} />
      <Route path="/menu/:id" element={<div>Dish Details</div>} />

      {/* Guest Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* Public Error Route */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/orders" element={<div>My Orders</div>} />
        <Route path="/reservations" element={<div>My Reservations</div>} />
        <Route path="/favorites" element={<div>Favorites</div>} />

        {/* Admin Routes */}
        <Route element={<RoleGuard allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<div>Admin Dashboard</div>} />
          <Route path="/admin/analytics" element={<div>Analytics</div>} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default AppRoutes;