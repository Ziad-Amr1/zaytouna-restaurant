import { Route, Routes } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Registration from "@/pages/auth/Registration";
import Landing from "@/pages/public/Landing";
import MenuPage from "@/pages/public/MenuPage";
import DishDetailsPage from "@/pages/public/DishDetailsPage";
import UnauthorizedPage from "@/pages/public/UnauthorizedPage";
import NotFoundPage from "@/pages/public/NotFoundPage";
import ProfilePage from "@/pages/user/ProfilePage";
import OrdersPage from "@/pages/user/OrdersPage";
import ReservationsPage from "@/pages/user/ReservationsPage";
import FavoritesPage from "@/pages/user/FavoritesPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleGuard from "@/routes/RoleGuard";

// Layouts
import AuthLayout from "@/components/layouts/AuthLayout";
import PublicLayout from "@/components/layouts/PublicLayout";
import AdminLayout from "@/components/layouts/AdminLayout";

// Admin Pages
import DashboardOverview from "@/pages/admin/DashboardOverview";
import MenuManagement from "@/pages/admin/MenuManagement";
import OrdersManagement from "@/pages/admin/OrdersManagement";
import ReservationsManagement from "@/pages/admin/ReservationsManagement";
import UsersManagement from "@/pages/admin/UsersManagement";
import Analytics from "@/pages/admin/Analytics";

function AppRoutes() {
  return (
    <Routes>
      {/* Auth (standalone, no site chrome) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Route>

      {/* Public + user pages share the site chrome */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:id" element={<DishDetailsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Route>
      </Route>

      {/* Error pages (standalone) */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Admin console (protected + role-gated) */}
      <Route element={<ProtectedRoute />}>
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;