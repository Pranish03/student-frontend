import { Login } from "../pages/guest/login";
import { ForgotPassword } from "../pages/guest/forgot-password";
import { CheckEmail } from "../pages/guest/check-email";
import { ResetPassword } from "../pages/guest/reset-password";
import { RequireGuest } from "../components/auth/RequireGuest";

export const GuestRoutes = [
  {
    element: <RequireGuest />,
    children: [
      { element: <Login />, path: "/" },
      { element: <ForgotPassword />, path: "/forgot-password" },
      { element: <CheckEmail />, path: "/check-email" },
      { element: <ResetPassword />, path: "/reset-password/:token" },
    ],
  },
];
