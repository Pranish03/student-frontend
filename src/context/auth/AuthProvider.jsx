import { useEffect, useState } from "react";
import { axios } from "../../lib/axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser(res.data?.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        setError(error.response?.data?.message || "internal server error");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (data) => {
    try {
      setActionLoading(true);
      const res = await axios.post("/auth/login", data);
      setUser(res.data?.data);
      setError("");
      return { success: true, message: res.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/auth/logout");
      setUser(null);
    } finally {
      setUser(null);
    }
  };

  const clearError = () => setError("");

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        fetchUser,
        authLoading,
        login,
        actionLoading,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
