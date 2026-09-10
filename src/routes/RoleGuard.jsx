import { Outlet } from "react-router-dom";

function RoleGuard() {
  // Placeholder: no role enforcement yet.
  // Will gate the child route behind a required role (e.g. "admin").
  return <Outlet />;
}

export default RoleGuard;