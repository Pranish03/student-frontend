import { useRoutes } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";
import { AdminRoutes } from "./AdminRoutes";

export const AppRoutes = () => {
  return useRoutes([...AuthRoutes, AdminRoutes]);
};
