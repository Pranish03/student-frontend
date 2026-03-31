import { RequireAuth } from "../components/auth/RequireAuth";
import { TeacherLayout } from "../layouts/TeacherLayout.jsx";
import { ManageAttendance } from "../pages/teacher/manage-attendance";
import { ManageNotes } from "../pages/teacher/manage-notes";
import { ManageAssignment } from "../pages/teacher/manage-assignment";
import { ManageNotices } from "../pages/teacher/manage-notices";

import { Account } from "../pages/shared/account";
import { TeacherDashboard } from "../pages/teacher/dashboard";
import { Attendance } from "../pages/teacher/manage-attendance/Attendance";
import { Notes } from "../pages/teacher/manage-notes/Notes/index.jsx";
import { Assignment } from "../pages/teacher/manage-assignment/Assignment/index.jsx";

export const TeacherRoutes = {
  path: "/teacher",
  element: <RequireAuth allowedRoles={["teacher"]} />,
  children: [
    {
      element: <TeacherLayout />,
      children: [
        { element: <TeacherDashboard />, index: true },
        { element: <ManageAttendance />, path: "manage-attendance" },
        { element: <Attendance />, path: "manage-attendance/:id" },
        { element: <ManageNotes />, path: "manage-notes" },
        { element: <Notes />, path: "manage-notes/:id" },
        { element: <ManageAssignment />, path: "manage-assignment" },
        { element: <Assignment />, path: "manage-assignment/:id" },
        { element: <ManageNotices />, path: "manage-notices" },
        { element: <Account />, path: "account" },
      ],
    },
  ],
};
