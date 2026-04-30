import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LuChevronRight, LuClock, LuInbox, LuMapPin } from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";
import { axios } from "../../../lib/axios";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";
import { useState } from "react";

const fetchStudentClass = async () => {
  const { data } = await axios.get("/classes/my");
  return data;
};

const fetchScheduleByClass = async (classId) => {
  const { data } = await axios.get(`/schedules/class/${classId}`);
  return data;
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TIME_SLOTS = [
  { label: "First Period", start: "06:30", end: "08:00" },
  { label: "Break", start: "08:00", end: "08:30" },
  { label: "Second Period", start: "08:30", end: "10:00" },
  { label: "Third Period", start: "10:00", end: "11:30" },
];

const DAY_COLORS = {
  Sunday: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    dot: "bg-rose-400",
  },
  Monday: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  Tuesday: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    dot: "bg-violet-400",
  },
  Wednesday: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  Thursday: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  Friday: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    dot: "bg-cyan-400",
  },
  Saturday: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
};

const isCurrentSlot = (day, startTime, endTime) => {
  const now = new Date();
  const currentDay = DAYS[now.getDay()];
  if (currentDay !== day) return false;

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  return nowMinutes >= startMinutes && nowMinutes < endMinutes;
};

const isToday = (day) => DAYS[new Date().getDay()] === day;

// ─── Grid View ───────────────────────────────────────────────────────────────

const GridView = ({ scheduleMatrix, activeDays }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-28 min-w-28" />
            {TIME_SLOTS.map((slot) => (
              <th key={slot.label} className="text-center pb-3 min-w-44">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {slot.label}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {slot.start} – {slot.end}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activeDays.map((day, dayIndex) => {
            const colors = DAY_COLORS[day];
            const today = isToday(day);

            return (
              <tr key={day}>
                {/* Day label */}
                <td className="pr-2 py-1">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-[10px] ${
                      today ? "bg-green-600" : "bg-zinc-100"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        today ? "bg-white" : colors.dot
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        today ? "text-white" : "text-zinc-700"
                      }`}
                    >
                      {day.slice(0, 3).toUpperCase()}
                    </span>
                    {today && (
                      <span className="text-xs text-green-100 font-medium">
                        Today
                      </span>
                    )}
                  </div>
                </td>

                {TIME_SLOTS.map((slot) => {
                  const isBreak = slot.label === "Break";

                  if (isBreak) {
                    // Break cell spans all days via rowSpan on first day
                    if (dayIndex === 0) {
                      return (
                        <td
                          key={slot.label}
                          rowSpan={activeDays.length}
                          className="py-1"
                        >
                          <div className="h-full min-h-16 flex flex-col items-center justify-center bg-amber-50 border border-amber-200 rounded-[10px] px-3 py-3">
                            <LuClock
                              size={14}
                              className="text-amber-500 mb-1"
                            />
                            <p className="text-xs font-semibold text-amber-600">
                              Break
                            </p>
                            <p className="text-xs text-amber-500">
                              {slot.start} – {slot.end}
                            </p>
                          </div>
                        </td>
                      );
                    }
                    return null;
                  }

                  const entry =
                    scheduleMatrix[day]?.[`${slot.start}-${slot.end}`];
                  const current =
                    entry && isCurrentSlot(day, slot.start, slot.end);

                  return (
                    <td key={slot.label} className="py-1">
                      {entry ? (
                        <div
                          className={`relative rounded-[10px] border px-3 py-2.5 h-full min-h-16 transition-all
                            ${
                              current
                                ? "bg-green-600 border-green-700 shadow-md shadow-green-200"
                                : `${colors.bg} ${colors.border}`
                            }`}
                        >
                          {current && (
                            <span className="absolute top-2 right-2 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                            </span>
                          )}
                          <p
                            className={`font-semibold text-sm leading-snug ${
                              current ? "text-white" : colors.text
                            }`}
                          >
                            {entry.course?.name}
                          </p>
                          {entry.course?.code && (
                            <span
                              className={`inline-flex items-center gap-1 text-xs mt-1 font-medium px-1.5 py-0.5 rounded-full
                                ${
                                  current
                                    ? "bg-white/20 text-white"
                                    : "bg-white/70 " + colors.text
                                }`}
                            >
                              <BsFileEarmarkCodeFill size={9} />
                              {entry.course.code}
                            </span>
                          )}
                          {entry.room && entry.room !== "TBD" && (
                            <p
                              className={`flex items-center gap-1 text-xs mt-1.5 ${
                                current ? "text-green-100" : "text-zinc-500"
                              }`}
                            >
                              <LuMapPin size={10} />
                              {entry.room}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="min-h-16 rounded-[10px] border border-dashed border-zinc-200 bg-zinc-50/50" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── List View ────────────────────────────────────────────────────────────────

const ListView = ({ scheduleMatrix, activeDays }) => {
  return (
    <div className="space-y-4">
      {activeDays.map((day) => {
        const colors = DAY_COLORS[day];
        const today = isToday(day);

        const dayEntries = TIME_SLOTS.filter((s) => s.label !== "Break")
          .map((slot) => ({
            slot,
            entry: scheduleMatrix[day]?.[`${slot.start}-${slot.end}`],
          }))
          .filter((x) => x.entry);

        if (!dayEntries.length) return null;

        return (
          <div
            key={day}
            className={`rounded-[14px] border overflow-hidden ${
              today
                ? "border-green-300 shadow-sm shadow-green-100"
                : "border-zinc-200"
            }`}
          >
            {/* Day Header */}
            <div
              className={`flex items-center gap-3 px-5 py-3 ${
                today ? "bg-green-600" : "bg-zinc-50 border-b border-zinc-100"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${today ? "bg-white" : colors.dot}`}
              />
              <h3
                className={`font-semibold text-base ${
                  today ? "text-white" : "text-zinc-800"
                }`}
              >
                {day}
              </h3>
              {today && (
                <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                  Today
                </span>
              )}
              <span
                className={`ml-auto text-xs font-medium ${
                  today ? "text-green-100" : "text-zinc-400"
                }`}
              >
                {dayEntries.length} class{dayEntries.length !== 1 ? "es" : ""}
              </span>
            </div>

            {/* Entries */}
            <div className="divide-y divide-zinc-100">
              {dayEntries.map(({ slot, entry }) => {
                const current = isCurrentSlot(day, slot.start, slot.end);

                return (
                  <div
                    key={slot.label}
                    className={`flex items-center gap-4 px-5 py-3.5 ${
                      current ? "bg-green-50" : "bg-white"
                    }`}
                  >
                    {/* Time */}
                    <div className="shrink-0 text-center w-20">
                      <p
                        className={`text-xs font-semibold ${current ? "text-green-600" : "text-zinc-500"}`}
                      >
                        {slot.start}
                      </p>
                      <div
                        className={`h-px w-full my-0.5 ${current ? "bg-green-300" : "bg-zinc-200"}`}
                      />
                      <p
                        className={`text-xs font-semibold ${current ? "text-green-600" : "text-zinc-500"}`}
                      >
                        {slot.end}
                      </p>
                    </div>

                    {/* Color bar */}
                    <div
                      className={`w-1 self-stretch rounded-full shrink-0 ${
                        current ? "bg-green-500" : colors.dot
                      }`}
                    />

                    {/* Course info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-zinc-900 text-sm">
                          {entry.course?.name}
                        </p>
                        {current && (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Now
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {entry.course?.code && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium ${colors.text}`}
                          >
                            <BsFileEarmarkCodeFill size={10} />
                            {entry.course.code}
                          </span>
                        )}
                        {entry.room && entry.room !== "TBD" && (
                          <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                            <LuMapPin size={10} />
                            {entry.room}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Period label */}
                    <span className="shrink-0 text-xs text-zinc-400 font-medium hidden sm:block">
                      {slot.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const StudentSchedule = () => {
  const [view, setView] = useState("grid");

  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["student-class"],
    queryFn: fetchStudentClass,
    staleTime: 5 * 60 * 1000,
  });

  const classId = classData?.data?._id;
  const classInfo = classData?.data;

  const { data: scheduleData, isLoading: scheduleLoading } = useQuery({
    queryKey: ["student-schedule", classId],
    queryFn: () => fetchScheduleByClass(classId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
  });

  const schedule = scheduleData?.data;
  const isLoading = classLoading || scheduleLoading;

  // Build schedule matrix: { day: { "start-end": entry } }
  const scheduleMatrix = (() => {
    if (!schedule?.timeTable) return {};
    const matrix = {};
    for (const entry of schedule.timeTable) {
      if (!matrix[entry.day]) matrix[entry.day] = {};
      matrix[entry.day][`${entry.startTime}-${entry.endTime}`] = entry;
    }
    return matrix;
  })();

  // Only show days that have at least one entry
  const activeDays = DAYS.filter((day) =>
    TIME_SLOTS.filter((s) => s.label !== "Break").some(
      (slot) => scheduleMatrix[day]?.[`${slot.start}-${slot.end}`],
    ),
  );

  const totalClasses = schedule?.timeTable?.length ?? 0;

  return (
    <Container>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 mb-4 text-sm">
        <Link
          className="text-zinc-500 hover:underline hover:text-zinc-900"
          to="/student"
        >
          Student
        </Link>
        <LuChevronRight size={14} className="text-zinc-400" />
        <span className="text-zinc-900 font-medium">Schedule</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <Heading className="mb-1">Class Schedule</Heading>
          <Paragraph>
            {isLoading
              ? "Loading..."
              : classInfo
                ? `${classInfo.name} · ${classInfo.department} · ${classInfo.academicYear}`
                : "No class assigned"}
          </Paragraph>
        </div>

        {/* View Toggle */}
        {schedule && (
          <div className="bg-zinc-100 p-1 rounded-xl border border-zinc-200 flex gap-1">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-1.5 rounded-[9px] text-sm font-medium transition-all cursor-pointer
                ${
                  view === "grid"
                    ? "bg-white text-green-600 shadow border border-zinc-200"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-[9px] text-sm font-medium transition-all cursor-pointer
                ${
                  view === "list"
                    ? "bg-white text-green-600 shadow border border-zinc-200"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              List
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <ImSpinner8 size={32} className="animate-spin text-green-600" />
          <p className="mt-3 text-zinc-500 text-sm">Loading schedule...</p>
        </div>
      ) : !classId ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <LuInbox size={56} className="text-zinc-300 mb-3" />
          <p className="text-zinc-500 font-semibold text-lg">
            Not enrolled in any class
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            Contact your administrator to be assigned to a class
          </p>
        </div>
      ) : !schedule || activeDays.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <LuClock size={56} className="text-zinc-300 mb-3" />
          <p className="text-zinc-500 font-semibold text-lg">No schedule yet</p>
          <p className="text-zinc-400 text-sm mt-1">
            Your administrator hasn't set up a schedule for your class yet
          </p>
        </div>
      ) : (
        <>
          {/* Stats bar */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-[10px] px-3 py-2">
              <LuClock size={14} className="text-green-600" />
              <span>
                <span className="font-semibold text-zinc-700">
                  {totalClasses}
                </span>{" "}
                classes per week
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-[10px] px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>
                <span className="font-semibold text-zinc-700">
                  {activeDays.length}
                </span>{" "}
                active days
              </span>
            </div>
          </div>

          {/* Schedule */}
          {view === "grid" ? (
            <GridView scheduleMatrix={scheduleMatrix} activeDays={activeDays} />
          ) : (
            <ListView scheduleMatrix={scheduleMatrix} activeDays={activeDays} />
          )}

          {/* Legend */}
          {view === "grid" && (
            <div className="flex items-center gap-4 mt-5 flex-wrap">
              <p className="text-xs text-zinc-400 font-medium">Legend:</p>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="w-3 h-3 rounded-sm bg-green-600" /> Current
                class
              </span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-200" />{" "}
                Break
              </span>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="w-3 h-3 rounded-sm border-2 border-dashed border-zinc-300" />{" "}
                Free slot
              </span>
            </div>
          )}
        </>
      )}
    </Container>
  );
};
