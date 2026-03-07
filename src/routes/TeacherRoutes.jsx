import { RequireAuth } from "../components/auth/RequireAuth";
import { TeacherLayout } from "../layouts/TeacherLayout.jsx";
import { ManageAttandence } from "../pages/teacher/manage-attendence";
import { ManageNotes } from "../pages/teacher/manage-notes";

import { Account } from "../pages/shared/account";
import { TeacherDashboard } from "../pages/teacher/dashboard";

export const TeacherRoutes = {
  path: "/teacher",
  element: <RequireAuth allowedRoles={["teacher"]} />,
  children: [
    {
      element: <TeacherLayout />,
      children: [
        { element: <TeacherDashboard />, index: true },
        { element: <ManageAttandence />, path: "manage-attandence" },
        { element: <ManageNotes />, path: "manage-notes" },
        { element: <Account />, path: "account" },
      ],
    },
  ],
};
