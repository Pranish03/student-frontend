import { RequireAuth } from "../components/auth/RequireAuth";
import { StudentLayout } from "../layouts/StudentLayout.jsx";
import { ManageCourses } from "../pages/student/manage-courses";
import { CourseDetail } from "../pages/student/manage-courses/course";
import { ManageNotices } from "../pages/student/manage-notices";
import { Account } from "../pages/shared/account";
import { StudentDashboard } from "../pages/student/dashboard";
import { StudentAttendance } from "../pages/student/attendance/index.jsx";

export const StudentRoutes = {
  path: "/student",
  element: <RequireAuth allowedRoles={["student"]} />,
  children: [
    {
      element: <StudentLayout />,
      children: [
        { element: <StudentDashboard />, index: true },
        { element: <ManageCourses />, path: "manage-courses" },
        { element: <StudentAttendance />, path: "attendance" },
        { element: <CourseDetail />, path: "manage-courses/:id" },
        { element: <ManageNotices />, path: "manage-notices" },
        { element: <Account />, path: "account" },
      ],
    },
  ],
};
