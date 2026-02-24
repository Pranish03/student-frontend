import { useEffect, useState } from "react";
import { axios } from "../lib/axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/auth/me");
      setUser(res.data?.data);
      setError("");
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        setError(error.response?.data?.message || "internal server error");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    try {
      const res = await axios.post("/auth/login", data);
      setUser(res.data?.data);
      setError("");
      return { success: true, message: res.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }
  };

  const logout = async () => {
    await axios.get("/auth/logout");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, fetchUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
