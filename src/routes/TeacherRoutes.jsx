import { RequireAuth } from "../components/auth/RequireAuth";
import { TeacherLayout } from "../layouts/TeacherLayout.jsx";
import { ManageAttendance } from "../pages/teacher/manage-attendance";
import { ManageNotes } from "../pages/teacher/manage-notes";
import { ManageAssignment } from "../pages/teacher/manage-assignment";
import { ManageNotices } from "../pages/teacher/manage-notices";

import { Account } from "../pages/shared/account";
import { TeacherDashboard } from "../pages/teacher/dashboard";
import { Attend } from "../pages/teacher/manage-attendance/Attend.jsx";

export const TeacherRoutes = {
  path: "/teacher",
  element: <RequireAuth allowedRoles={["teacher"]} />,
  children: [
    {
      element: <TeacherLayout />,
      children: [
        { element: <TeacherDashboard />, index: true },
        { element: <ManageAttendance />, path: "manage-attendance" },
        { element: <Attend />, path: "manage-attendance/:id" },
        { element: <ManageNotes />, path: "manage-notes" },
        { element: <ManageAssignment />, path: "manage-assignment" },
        { element: <ManageNotices />, path: "manage-notices" },
        { element: <Account />, path: "account" },
      ],
    },
  ],
};
