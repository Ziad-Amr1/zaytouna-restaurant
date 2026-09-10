import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "@/hooks/useAuth";
import LoadingScreen from "@/components/ui/LoadingScreen";

function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;