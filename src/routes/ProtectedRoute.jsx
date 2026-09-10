import { Outlet } from "react-router-dom";

function ProtectedRoute() {
  // Placeholder: no auth enforcement yet.
  // Will render the child route only when the user is authenticated.
  return <Outlet />;
}

export default ProtectedRoute;