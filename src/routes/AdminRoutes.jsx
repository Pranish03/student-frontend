import { RequireAuth } from "../components/auth/RequireAuth.jsx";
import { AdminLayout } from "../layouts/AdminLayout.jsx";
import { AdminDashboard } from "../pages/admin/dashboard";
import { ManageClasses } from "../pages/admin/manage-classes";
import { ManageClass } from "../pages/admin/manage-classes/class";
import { ManageCourses } from "../pages/admin/manage-courses";
import { ManageStudents } from "../pages/admin/manage-students";
import { ManageTeachers } from "../pages/admin/manage-teachers";
import { ManageAdmins } from "../pages/admin/manage-admins";
import { Account } from "../pages/shared/account";

export const AdminRoutes = {
  path: "/admin",
  element: <RequireAuth allowedRoles={["admin"]} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { element: <AdminDashboard />, index: true },
        { element: <ManageClasses />, path: "manage-classes" },
        { element: <ManageClass />, path: "manage-classes/:id" },
        { element: <ManageCourses />, path: "manage-courses" },
        { element: <ManageStudents />, path: "manage-students" },
        { element: <ManageTeachers />, path: "manage-teachers" },
        { element: <ManageAdmins />, path: "manage-admins" },
        { element: <Account />, path: "account" },
      ],
    },
  ],
};
