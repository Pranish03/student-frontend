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
import { AdminDashboard } from "./pages/admin";

import { AdminLayout } from "./layouts/AdminLayout.jsx";
import { ManageStudent } from "./pages/admin/manage-user/student.jsx";
import { ManageTeacher } from "./pages/admin/manage-user/teacher.jsx";
import { ManageAdmin } from "./pages/admin/manage-user/admin.jsx";

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
            <Route element={<ManageStudent />} path="manage-student" />
            <Route element={<ManageTeacher />} path="manage-teacher" />
            <Route element={<ManageAdmin />} path="manage-admin" />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
