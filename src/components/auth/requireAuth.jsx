import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const RequireAuth = ({ allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return <Outlet />;
};
