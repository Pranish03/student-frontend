import { RequireAuth } from "../components/auth/RequireAuth";
import { TeacherLayout } from "../layouts/TeacherLayout.jsx";
import { ManageAttendance } from "../pages/teacher/manage-attendance";
import { ManageNotices } from "../pages/teacher/manage-notices";

import { Account } from "../pages/shared/account";
import { TeacherDashboard } from "../pages/teacher/dashboard";
import { Attendance } from "../pages/teacher/manage-attendance/Attendance";
import { ManageResources } from "../pages/teacher/manage-resources/index.jsx";
import { CourseResources } from "../pages/teacher/manage-resources/Course/index.jsx";

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
        { element: <ManageResources />, path: "manage-resources" },
        { element: <CourseResources />, path: "manage-resources/:id" },
        { element: <ManageNotices />, path: "manage-notices" },
        { element: <Account />, path: "account" },
      ],
    },
  ],
};
