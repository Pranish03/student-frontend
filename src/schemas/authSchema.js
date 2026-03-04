import * as z from "zod";

// User login validation schema
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

// Forgot password validation schema
export const forgotPasswordSchema = loginSchema
  .omit({ password: true })
  .strict();

// Reset password validation schema
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must have at least 8 characters"),
    confirm: z.string().min(8, "Password must have at least 8 characters"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password do not match",
    path: ["confirm"],
  });

// Update password validation schema
export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string("Current password is required")
      .min(8, "Current password must have at least 8 characters"),
    newPassword: z
      .string("Password is required")
      .min(8, "Password must have at least 8 characters"),
    confirmNew: z
      .string("Confirm password is required")
      .min(8, "confirm password must have at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNew, {
    message: "Password do not match",
    path: ["confirmNew"],
  });
