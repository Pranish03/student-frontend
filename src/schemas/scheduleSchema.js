import { z } from "zod";

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const timeSlots = [
  {
    title: "First Period",
    startTime: "06:30",
    endTime: "08:00",
  },
  {
    title: "Second Period",
    startTime: "08:30",
    endTime: "10:00",
  },
  {
    title: "Third Period",
    startTime: "10:00",
    endTime: "11:30",
  },
];

export const objectID = z.string().regex(/^[0-9a-fA-F]{24}$/);

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const timeTableEntry = z.object({
  course: objectID,
  day: z.enum(daysOfWeek),
  startTime: z.string().regex(timeRegex),
  endTime: z.string().regex(timeRegex),
  room: z.string().optional(),
});

export const createScheduleSchema = z.object({
  class: objectID,
  timeTable: z.array(timeTableEntry).optional(),
});

export const updateScheduleSchema = createScheduleSchema.partial();

export const addTimeTableEntrySchema = timeTableEntry;

export const updateTimeTableEntrySchema = timeTableEntry.partial();

export const scheduleIdSchema = z.object({
  id: objectID,
});

export const scheduleByClassSchema = z.object({
  classId: objectID,
});

export const timeTableParamsSchema = z.object({
  id: objectID,
  entryId: objectID,
});
