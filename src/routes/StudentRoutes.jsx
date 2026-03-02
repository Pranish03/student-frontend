import { RequireAuth } from "../components/auth/requireAuth";
import { StudentDashboard } from "../pages/student/dashboard";

export const StudentRoutes = {
  path: "/student",
  element: <RequireAuth allowedRoles={["student"]} />,
  children: [{ element: <StudentDashboard />, index: true }],
};
