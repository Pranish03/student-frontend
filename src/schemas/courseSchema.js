import { z } from "zod";

// Create Course validation schema
export const createCourseSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must have at least 3 characters"),
  code: z
    .string("Code is required")
    .min(3, "Code must have at least 3 characters"),
});

export const updateCourseSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must have at least 3 characters"),
  code: z
    .string("Code is required")
    .min(3, "Code must have at least 3 characters"),
});
