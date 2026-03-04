import { RequireAuth } from "../components/auth/RequireAuth";
import { Account } from "../pages/shared/account";
import { TeacherDashboard } from "../pages/teacher/dashboard";

export const TeacherRoutes = {
  path: "/teacher",
  element: <RequireAuth allowedRoles={["teacher"]} />,
  children: [
    { element: <TeacherDashboard />, index: true },
    { element: <Account />, path: "account" },
  ],
};
