import { Login } from "../pages/login";
import { ForgotPassword } from "../pages/forgot-password";
import { CheckEmail } from "../pages/check-email";
import { ResetPassword } from "../pages/reset-password";

export const AuthRoutes = [
  { element: <Login />, path: "/" },
  { element: <ForgotPassword />, path: "/forgot-password" },
  { element: <CheckEmail />, path: "/check-email" },
  { element: <ResetPassword />, path: "/reset-password/:token" },
];
