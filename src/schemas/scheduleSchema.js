import { z } from "zod";

const objectID = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
  .nullable()
  .optional();

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Base timetable entry schema
export const baseTimeTableEntrySchema = z.object({
  course: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  day: z.enum(daysOfWeek),
  startTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
  endTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
  room: z.string().default("TBD"),
});

// Create schedule entry schema (for adding new entries)
export const createScheduleEntrySchema = baseTimeTableEntrySchema.strict();

// Update schedule entry schema (for editing existing entries)
export const updateScheduleEntrySchema = baseTimeTableEntrySchema
  .partial()
  .strict();

// Base schedule schema
export const baseScheduleSchema = z.object({
  class: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  timeTable: z.array(baseTimeTableEntrySchema).default([]),
});

// Create schedule validation schema
export const createScheduleSchema = baseScheduleSchema.strict();

// Update schedule validation schema
export const updateScheduleSchema = baseScheduleSchema.partial().strict();

// Get schedule by id validation schema
export const scheduleIdSchema = z.object({
  id: objectID,
});

// Get schedule by class validation schema
export const scheduleByClassSchema = z.object({
  classId: objectID,
});

// Add timetable entry validation schema
export const addTimeTableEntrySchema = baseTimeTableEntrySchema.strict();

// Update timetable entry validation schema (for updating specific entries)
export const updateTimeTableEntrySchema = baseTimeTableEntrySchema
  .partial()
  .strict()
  .extend({
    entryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
      .optional(),
  });

// Remove timetable entry validation schema
export const removeTimeTableEntrySchema = z.object({
  entryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
});

// Validate time order schema
export const validateTimeOrderSchema = baseTimeTableEntrySchema.refine(
  (data) => {
    return data.startTime < data.endTime;
  },
  {
    message: "Start time must be before end time",
    path: ["startTime"],
  },
);
