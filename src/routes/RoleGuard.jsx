import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import LoadingScreen from "@/components/ui/LoadingScreen";

function RoleGuard({ allowedRoles = [] }) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RoleGuard;