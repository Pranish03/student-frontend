import { RequireAuth } from "../components/auth/RequireAuth";
import { Account } from "../pages/shared/account";
import { StudentDashboard } from "../pages/student/dashboard";

export const StudentRoutes = {
  path: "/student",
  element: <RequireAuth allowedRoles={["student"]} />,
  children: [
    { element: <StudentDashboard />, index: true },
    { element: <Account />, path: "account" },
  ],
};
