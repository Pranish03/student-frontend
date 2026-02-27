import { useRoutes } from "react-router-dom";
import { GuestRoutes } from "./GuestRoutes";
import { AdminRoutes } from "./AdminRoutes";

export const AppRoutes = () => {
  return useRoutes([...GuestRoutes, AdminRoutes]);
};
