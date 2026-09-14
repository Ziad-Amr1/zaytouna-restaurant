import { Route, Routes } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Registration from "@/pages/auth/Registration";
import Landing from "@/pages/public/Landing";
import MenuPage from "@/pages/public/MenuPage";
import DishDetailsPage from "@/pages/public/DishDetailsPage";
import UnauthorizedPage from "@/pages/public/UnauthorizedPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleGuard from "@/routes/RoleGuard";

// Layout & Admin Pages
import AdminLayout from "@/components/layouts/AdminLayout";
import DashboardOverview from "@/pages/admin/DashboardOverview";
import MenuManagement from "@/pages/admin/MenuManagement";
import OrdersManagement from "@/pages/admin/OrdersManagement";
import ReservationsManagement from "@/pages/admin/ReservationsManagement";
import UsersManagement from "@/pages/admin/UsersManagement";
import Analytics from "@/pages/admin/Analytics";

function AppRoutes() {
  return (
    <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:id" element={<DishDetailsPage />} />

        {/* Guest Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Public Error Route */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<div>Profile</div>} />
          <Route path="/orders" element={<div>My Orders</div>} />
          <Route path="/reservations" element={<div>My Reservations</div>} />
          <Route path="/favorites" element={<div>Favorites</div>} />

          {/* Role-Based Admin Routes */}
          <Route element={<RoleGuard allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="reservations" element={<ReservationsManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
  );
}

export default AppRoutes;