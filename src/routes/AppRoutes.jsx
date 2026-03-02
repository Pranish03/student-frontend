import { useRoutes } from "react-router-dom";
import { GuestRoutes } from "./GuestRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { TeacherRoutes } from "./TeacherRoutes";
import { StudentRoutes } from "./StudentRoutes";

export const AppRoutes = () => {
  return useRoutes([...GuestRoutes, AdminRoutes, TeacherRoutes, StudentRoutes]);
};
