import { useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/api/authApi";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  // If no token exists there is nothing to restore, so start
  // not-loading; otherwise we wait for /auth/me before rendering.
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(
    () => localStorage.getItem("token") !== null
  );

  const isAuthenticated = !isLoading && user !== null;

  const persistSession = (session) => {
    localStorage.setItem("token", session.token);
    localStorage.setItem("user", JSON.stringify(session.user));
    setUser(session.user);
  };

  const login = async (email, password) => {
    const response = await loginUser(email, password);
    const session = response.data;
    persistSession(session);
    return session;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    const session = response.data;
    persistSession(session);
    return session;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  // Restore the session on app start by validating the stored token.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    let cancelled = false;

    const restoreSession = async () => {
      try {
        const response = await getCurrentUser();
        if (!cancelled) {
          setUser(response.data);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // Clear the session when the API reports an unauthorized response.
  useEffect(() => {
    const clearSession = () => {
      setIsLoading(false);
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", clearSession);

    return () => {
      window.removeEventListener("auth:unauthorized", clearSession);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;