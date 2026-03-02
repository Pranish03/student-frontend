import { AdminLayout } from "../layouts/AdminLayout.jsx";
import { AdminDashboard } from "../pages/admin/dashboard";
import { ManageBatch } from "../pages/admin/manage-batch";
import { ManageClasses } from "../pages/admin/manage-classes";
import { ManageCourses } from "../pages/admin/manage-courses";
import { ManageStudents } from "../pages/admin/manage-students";
import { ManageTeachers } from "../pages/admin/manage-teachers";
import { ManageAdmins } from "../pages/admin/manage-admins";
import { RequireAuth } from "../components/auth/requireAuth.jsx";

export const AdminRoutes = {
  path: "/admin",
  element: <RequireAuth allowedRoles={["admin"]} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { element: <AdminDashboard />, index: true },
        { element: <ManageBatch />, path: "manage-batch" },
        { element: <ManageClasses />, path: "manage-classes" },
        { element: <ManageCourses />, path: "manage-courses" },
        { element: <ManageStudents />, path: "manage-students" },
        { element: <ManageTeachers />, path: "manage-teachers" },
        { element: <ManageAdmins />, path: "manage-admins" },
      ],
    },
  ],
};
