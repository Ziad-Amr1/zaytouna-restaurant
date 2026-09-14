import { useEffect, useMemo, useState } from "react";

import { getCurrentUser, loginUser, registerUser } from "@/api/authApi";

import AuthContext from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(() => {
    return Boolean(localStorage.getItem("token"));
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    let cancelled = false;

    async function restoreSession() {
      try {
        const response = await getCurrentUser();
        const currentUser = response?.data;

        if (cancelled) {
          return;
        }

        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch {
        if (cancelled) {
          return;
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoading(false);
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  async function login(email, password) {
    const response = await loginUser(email, password);
    const session = response?.data;

    if (!session?.token || !session?.user) {
      throw new Error("Invalid login response from server.");
    }

    localStorage.setItem("token", session.token);
    localStorage.setItem("user", JSON.stringify(session.user));

    setUser(session.user);

    return session;
  }

  async function register(payload) {
    const response = await registerUser(payload);
    const session = response?.data;

    if (!session?.token || !session?.user) {
      throw new Error("Invalid registration response from server.");
    }

    localStorage.setItem("token", session.token);
    localStorage.setItem("user", JSON.stringify(session.user));

    setUser(session.user);

    return session;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
