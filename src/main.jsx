import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/auth/AuthProvider.jsx";
import { AppRoutes } from "./routes/AppRoutes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-center" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
