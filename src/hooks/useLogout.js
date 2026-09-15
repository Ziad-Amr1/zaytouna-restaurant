import { useNavigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

/** Log out and go home. One definition instead of one per navbar variant. */
export default function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return function handleLogout() {
    logout();
    navigate("/");
  };
}
