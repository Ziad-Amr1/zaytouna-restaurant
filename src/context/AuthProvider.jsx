import { useCallback, useEffect, useMemo, useState } from "react";

import { getCurrentUser, loginUser, registerUser } from "@/api/authApi";
import { storage } from "@/lib/storage";

import AuthContext from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getJSON("user", null));

  const [isLoading, setIsLoading] = useState(() => {
    return Boolean(storage.getItem("token"));
  });

  useEffect(() => {
    const token = storage.getItem("token");

    if (!token) {
      setIsLoading(false);
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
          storage.setItem("user", currentUser);
        } else {
          storage.removeItem("token");
          storage.removeItem("user");
          setUser(null);
        }
      } catch {
        if (cancelled) {
          return;
        }

        storage.removeItem("token");
        storage.removeItem("user");
        setUser(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      storage.removeItem("token");
      storage.removeItem("user");
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

    storage.setItem("token", session.token);
    storage.setItem("user", session.user);

    setUser(session.user);

    return session;
  }

  async function register(payload) {
    const response = await registerUser(payload);
    const session = response?.data;

    if (!session?.token || !session?.user) {
      throw new Error("Invalid registration response from server.");
    }

    storage.setItem("token", session.token);
    storage.setItem("user", session.user);

    setUser(session.user);

    return session;
  }

  function logout() {
    storage.removeItem("token");
    storage.removeItem("user");
    setUser(null);
  }

  const updateUser = useCallback(
    (updatedFields) => {
      setUser((prevUser) => {
        const updatedUser = { ...prevUser, ...updatedFields };
        storage.setItem("user", updatedUser);
        return updatedUser;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, isLoading, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
