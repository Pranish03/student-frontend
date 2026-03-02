import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { getMe } from "../../api/auth";

export const AuthProvider = ({ children }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  const user = data?.data ?? null;

  const value = {
    user,
    isLoading,
    error,
    refetch,
    isAuthenticated: !!data?.data,
    role: user?.role ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
