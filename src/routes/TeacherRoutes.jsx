import { RequireAuth } from "../components/auth/RequireAuth";
import { TeacherLayout } from "../layouts/TeacherLayout.jsx";
import { ManageAttendence } from "../pages/teacher/manage-attendence";
import { ManageNotes } from "../pages/teacher/manage-notes";
import { ManageAssignment } from "../pages/teacher/manage-assignment";
import { ManageNotices } from "../pages/teacher/manage-notices";

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
        { element: <ManageAttendence />, path: "manage-attandence" },
        { element: <ManageNotes />, path: "manage-notes" },
        { element: <ManageAssignment />, path: "manage-assignment" },
        { element: <ManageNotices />, path: "manage-notices" },
        { element: <Account />, path: "account" },
      ],
    },
  ],
};
