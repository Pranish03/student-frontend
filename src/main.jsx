import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Login } from "./pages/login";
import { ForgotPassword } from "./pages/forgot-password";
import { CheckEmail } from "./pages/check-email";
import { ResetPassword } from "./pages/reset-password";
import { AdminDashboard } from "./pages/admin";

import { StudentDashboard } from "./pages/student";
import TeacherDashboard from "./pages/teacher/index.jsx";
import ManageStudent from "./pages/teacher/managestudent/index.jsx";
import AddStudent from "./pages/teacher/managestudent/add-student.jsx";
import ManageTeacher from "./pages/teacher/manageteacher/index.jsx";
import AddTeacher from "./pages/teacher/manageteacher/add-teacher.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

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
          <Route element={<StudentDashboard />} path="/student" />
          <Route element={<AdminDashboard />} path="/admin" />

          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/manage-student" element={<ManageStudent />} />
          <Route path="/manage-teacher" element={<ManageTeacher />} />
          <Route path="/add-teacher" element={<AddTeacher />} />
          <Route path="/add-student" element={<AddStudent />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
