import { RequireAuth } from "../components/auth/RequireAuth";
import { StudentLayout } from "../layouts/StudentLayout.jsx";
import { ManageCourses } from "../pages/student/manage-courses";

import { Account } from "../pages/shared/account";
import { StudentDashboard } from "../pages/student/dashboard";

export const StudentRoutes = {
  path: "/student",
  element: <RequireAuth allowedRoles={["student"]} />,
  children: [
    {
      element: <StudentLayout />,
      children: [
        { element: <StudentDashboard />, index: true },
        { element: <ManageCourses />, path: "manage-courses" },

        { element: <Account />, path: "account" },
      ],
    },
  ],
};
