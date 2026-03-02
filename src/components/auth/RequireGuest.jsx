import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const RequireGuest = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) return null; // Loading

  if (isAuthenticated) return <Navigate to={`/${role}`} replace />;

  return <Outlet />;
};
