import { createContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
} from "../api/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (data) => {
    const result = await loginUser(data);
    setUser(result.user);
    return result;
  };

  const register = async (data) => {
  const result = await registerUser(data);
  setUser(result.user);
  return result;
};

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getMe();
        setUser(result.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};