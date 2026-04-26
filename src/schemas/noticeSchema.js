import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  targetRole: z.enum(["all", "student", "teacher"]).default("all"),
  file: z.any().optional(),
});

export const updateNoticeSchema = createNoticeSchema.partial();
