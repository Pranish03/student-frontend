import { z } from "zod";

// Create student validation schema
export const createStudentSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must have at least 3 characters"),
  email: z.email("Invalid email address"),
  role: z.string().default("student"),
});

// Update student validation schema
export const updateStudentSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must have at least 3 characters"),
  email: z.email("Invalid email address"),
});
