import { RequireAuth } from "../components/auth/requireAuth";
import { TeacherDashboard } from "../pages/teacher/dashboard";

export const TeacherRoutes = {
  path: "/teacher",
  element: <RequireAuth allowedRoles={["teacher"]} />,
  children: [{ element: <TeacherDashboard />, index: true }],
};
