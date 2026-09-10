import { createContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize user session directly from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("zaytouna_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoading] = useState(false);

  const login = async (email, password) => {
    // Reference password to satisfy ESLint no-unused-vars rule
    void password;
    await new Promise((resolve) => setTimeout(resolve, 500));

    const role = email.toLowerCase().includes("admin") ? "admin" : "user";
    const loggedUser = {
      id: "usr_1",
      name: email.split("@")[0],
      email: email,
      role: role,
    };

    localStorage.setItem("zaytouna_user", JSON.stringify(loggedUser));
    localStorage.setItem("token", "mock-jwt-token-zaytouna");
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async ({ name, email, password }) => {
    void password;
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser = {
      id: "usr_" + Date.now(),
      name: name,
      email: email,
      role: "admin",
    };

    localStorage.setItem("zaytouna_user", JSON.stringify(newUser));
    localStorage.setItem("token", "mock-jwt-token-zaytouna");
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("zaytouna_user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;