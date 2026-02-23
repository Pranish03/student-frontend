import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login }from "./pages/login/index.jsx";
import StudentDashboard from "./pages/student/index.jsx";
import TeacherDashboard from "./pages/teacher/index.jsx";
import ManageStudent from "./pages/teacher/managestudent/index.jsx";
import AddStudent from "./pages/teacher/managestudent/add-student.jsx";
import ManageTeacher from "./pages/teacher/manageteacher/index.jsx";
import AddTeacher from "./pages/teacher/manageteacher/add-teacher.jsx";
import ResetPassword from "./pages/reset/index.jsx";
import SendEmail from "./pages/reset/SendEmail.jsx";
import CheckEmail from "./pages/reset/Verification.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        
        <Route index element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/send-email" element={<SendEmail />}/>
        <Route path="/check-email" element={<CheckEmail />}/>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/manage-student" element={<ManageStudent />} />
        <Route path="/manage-teacher" element={<ManageTeacher />} />
        <Route path="/add-teacher" element={<AddTeacher />} />

        <Route path="/add-student" element={<AddStudent />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
