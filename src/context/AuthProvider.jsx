import { useEffect, useState } from "react";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
} from "@/api/authApi";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true)

    const isAuthenticated = !isLoading && user !== null;

    //Login
    const login = async (email, password) => {
        const data = await loginUser(email, password);

        const { user } = data;

        setUser(user);

        return data;
    }


    //Logout
    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    };

    // restore authentication
    useEffect(() => {
        const restoreAuthentication = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data.user);
            } catch {
                setUser(null)
            } finally {
                setIsLoading(false);
            }
        }

        restoreAuthentication();
    }, [])

    // clear the session when the API reports an unauthorized response
    useEffect(() => {
        const clearSession = () => {
            setIsLoading(false);
            setUser(null);
        };

        window.addEventListener("auth:unauthorized", clearSession);

        return () => {
            window.removeEventListener("auth:unauthorized", clearSession);
        };
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
