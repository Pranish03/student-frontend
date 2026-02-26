import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthProvider.jsx";

import { Login } from "./pages/login";
import { ForgotPassword } from "./pages/forgot-password";
import { CheckEmail } from "./pages/check-email";
import { ResetPassword } from "./pages/reset-password";

import { AdminLayout } from "./layouts/AdminLayout.jsx";
import { AdminDashboard } from "./pages/admin/dashboard";
import { ManageBatch } from "./pages/admin/manage-batch";
import { ManageClasses } from "./pages/admin/manage-classes";
import { ManageCourses } from "./pages/admin/manage-courses";
import { ManageStudents } from "./pages/admin/manage-students";
import { ManageTeachers } from "./pages/admin/manage-teachers";
import { ManageAdmins } from "./pages/admin/manage-admins";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-center" />
        <Routes>
          <Route element={<Login />} index />
          <Route element={<ForgotPassword />} path="/forgot-password" />
          <Route element={<CheckEmail />} path="/check-email" />
          <Route element={<ResetPassword />} path="/reset-password/:token" />

          <Route element={<AdminLayout />} path="/admin">
            <Route element={<AdminDashboard />} index />
            <Route element={<ManageBatch />} path="manage-batch" />
            <Route element={<ManageClasses />} path="manage-classes" />
            <Route element={<ManageCourses />} path="manage-courses" />
            <Route element={<ManageStudents />} path="manage-students" />
            <Route element={<ManageTeachers />} path="manage-teachers" />
            <Route element={<ManageAdmins />} path="manage-admins" />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
