/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  LuChevronRight,
  LuClock,
  LuInbox,
  LuMapPin,
  LuCalendar,
  LuBuilding,
} from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";
import { useAuth } from "../../../hooks/useAuth";
import { axios } from "../../../lib/axios";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";

const fetchTeacherCourses = async (teacherId) => {
  const { data } = await axios.get(`/courses?teacher=${teacherId}`);
  return data;
};

const fetchScheduleByClass = async (classId) => {
  try {
    const { data } = await axios.get(`/schedules/class/${classId}`);
    return data;
  } catch (err) {
    if (err.response?.status === 404) return { data: null };
    throw err;
  }
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
    accent: "bg-rose-500",
  },
  Monday: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-400",
    accent: "bg-blue-500",
  },
  Tuesday: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    dot: "bg-violet-400",
    accent: "bg-violet-500",
  },
  Wednesday: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
    accent: "bg-amber-500",
  },
  Thursday: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-400",
    accent: "bg-green-500",
  },
  Friday: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    dot: "bg-cyan-400",
    accent: "bg-cyan-500",
  },
  Saturday: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-400",
    accent: "bg-orange-500",
  },
};

const isCurrentSlot = (day, startTime, endTime) => {
  const now = new Date();
  if (DAYS[now.getDay()] !== day) return false;
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= sh * 60 + sm && cur < eh * 60 + em;
};

const isToday = (day) => DAYS[new Date().getDay()] === day;

const buildMatrix = (timeTable = []) => {
  const matrix = {};
  for (const entry of timeTable) {
    if (!matrix[entry.day]) matrix[entry.day] = {};
    matrix[entry.day][`${entry.startTime}-${entry.endTime}`] = entry;
  }
  return matrix;
};

const ClassScheduleGrid = ({ schedule, teacherCourseIds }) => {
  const matrix = buildMatrix(schedule?.timeTable);

  const activeDays = DAYS.filter((day) =>
    TIME_SLOTS.filter((s) => s.label !== "Break").some(
      (slot) => matrix[day]?.[`${slot.start}-${slot.end}`],
    ),
  );

  if (activeDays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <LuClock size={40} className="text-zinc-300 mb-2" />
        <p className="text-zinc-500 text-sm font-medium">No entries yet</p>
        <p className="text-zinc-400 text-xs mt-0.5">
          The admin hasn't added any timetable entries
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 min-w-150">
        <thead>
          <tr>
            <th className="w-28 min-w-28" />
            {TIME_SLOTS.map((slot) => (
              <th key={slot.label} className="text-center pb-2 min-w-40">
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

                {TIME_SLOTS.map((slot, slotIndex) => {
                  const isBreak = slot.label === "Break";

                  if (isBreak) {
                    if (dayIndex === 0) {
                      return (
                        <td
                          key={slot.label}
                          rowSpan={activeDays.length}
                          className="py-1"
                        >
                          <div className="h-full min-h-16 flex flex-col items-center justify-center bg-amber-50 border border-amber-200 rounded-[10px] px-2 py-3">
                            <LuClock
                              size={13}
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

                  const entry = matrix[day]?.[`${slot.start}-${slot.end}`];
                  const isMyClass =
                    entry &&
                    teacherCourseIds.includes(
                      entry.course?._id ?? entry.course,
                    );
                  const current =
                    entry && isCurrentSlot(day, slot.start, slot.end);

                  return (
                    <td key={slot.label} className="py-1">
                      {entry ? (
                        <div
                          className={`relative rounded-[10px] border px-3 py-2.5 min-h-16 transition-all
                            ${
                              current
                                ? "bg-green-600 border-green-700 shadow-md shadow-green-200"
                                : isMyClass
                                  ? `${colors.bg} ${colors.border}`
                                  : "bg-zinc-50 border-zinc-200 opacity-60"
                            }`}
                        >
                          {current && (
                            <span className="absolute top-2 right-2 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                            </span>
                          )}

                          {isMyClass && !current && (
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-green-500" />
                          )}

                          <p
                            className={`font-semibold text-sm leading-snug ${
                              current ? "text-white" : colors.text
                            }`}
                          >
                            {entry.course?.name ?? "Course"}
                          </p>

                          {entry.course?.code && (
                            <span
                              className={`inline-flex items-center gap-1 text-xs mt-1 font-medium px-1.5 py-0.5 rounded-full
                                ${current ? "bg-white/20 text-white" : "bg-white/70 " + colors.text}`}
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
                        <div className="min-h-16 rounded-[10px] border border-dashed border-zinc-200 bg-zinc-50/40" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <p className="text-xs text-zinc-400 font-medium">Legend:</p>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-3 h-3 rounded-sm bg-green-600" /> Your current
          class
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-200" />
          Your class
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-3 h-3 rounded-sm bg-zinc-100 border border-zinc-200 opacity-60" />
          Other teacher's class
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-200" />
          Break
        </span>
      </div>
    </div>
  );
};

const ClassScheduleCard = ({ classInfo, teacherCourseIds, index }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["schedule", classInfo._id],
    queryFn: () => fetchScheduleByClass(classInfo._id),
    staleTime: 5 * 60 * 1000,
  });

  const schedule = data?.data;

  const myEntries =
    schedule?.timeTable?.filter((e) =>
      teacherCourseIds.includes(e.course?._id ?? e.course),
    ) ?? [];

  const totalClasses = schedule?.timeTable?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.08 }}
      className="bg-white border border-zinc-200 rounded-[14px] overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
            <LuBuilding size={18} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-zinc-900 text-base">
              {classInfo.name}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {classInfo.department}
              {classInfo.academicYear && ` · ${classInfo.academicYear}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isLoading && schedule && (
            <>
              <div className="text-right">
                <p className="text-xs text-zinc-400">Your classes</p>
                <p className="text-sm font-semibold text-green-600">
                  {myEntries.length} / {totalClasses}
                </p>
              </div>
              <div className="h-8 w-px bg-zinc-200" />
            </>
          )}
          <div className="text-right">
            <p className="text-xs text-zinc-400">Week total</p>
            <p className="text-sm font-semibold text-zinc-700">
              {isLoading ? "—" : totalClasses}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <ImSpinner8 size={24} className="animate-spin text-green-600" />
          </div>
        ) : !schedule ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <LuCalendar size={40} className="text-zinc-300 mb-2" />
            <p className="text-zinc-500 text-sm font-medium">
              No schedule set up
            </p>
            <p className="text-zinc-400 text-xs mt-0.5">
              Contact the admin to create a schedule for this class
            </p>
          </div>
        ) : (
          <ClassScheduleGrid
            schedule={schedule}
            teacherCourseIds={teacherCourseIds}
          />
        )}
      </div>
    </motion.div>
  );
};

export const TeacherSchedule = () => {
  const { user } = useAuth();

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", "teacher", user?._id],
    queryFn: () => fetchTeacherCourses(user._id),
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
  });

  const courses = coursesData?.data ?? [];

  const classMap = {};
  for (const course of courses) {
    if (course.class?._id) {
      classMap[course.class._id] = course.class;
    }
  }
  const uniqueClasses = Object.values(classMap);

  const teacherCourseIds = courses.map((c) => c._id);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container>
      <div className="flex items-center gap-1 mb-4 text-sm">
        <Link
          className="text-zinc-500 hover:underline hover:text-zinc-900"
          to="/teacher"
        >
          Teacher
        </Link>
        <LuChevronRight size={14} className="text-zinc-400" />
        <span className="text-zinc-900 font-medium">Schedule</span>
      </div>

      <div className="mb-8">
        <Heading className="mb-1">My Schedule</Heading>
        <Paragraph>
          {coursesLoading
            ? "Loading..."
            : `${today} · ${uniqueClasses.length} class${uniqueClasses.length !== 1 ? "es" : ""}`}
        </Paragraph>
      </div>

      {!coursesLoading && courses.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Courses teaching"
            value={courses.length}
            icon={
              <BsFileEarmarkCodeFill size={16} className="text-green-600" />
            }
            bg="bg-green-50"
          />
          <StatCard
            label="Classes assigned"
            value={uniqueClasses.length}
            icon={<LuBuilding size={16} className="text-blue-600" />}
            bg="bg-blue-50"
          />
          <StatCard
            label="Today"
            value={DAYS[new Date().getDay()]}
            icon={<LuCalendar size={16} className="text-amber-600" />}
            bg="bg-amber-50"
          />
        </div>
      )}

      {coursesLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <ImSpinner8 size={32} className="animate-spin text-green-600" />
          <p className="mt-3 text-zinc-500 text-sm">Loading your schedule...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <LuInbox size={56} className="text-zinc-300 mb-3" />
          <p className="text-zinc-500 font-semibold text-lg">
            No courses assigned
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            Contact the admin to be assigned to a course
          </p>
        </div>
      ) : uniqueClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <LuCalendar size={56} className="text-zinc-300 mb-3" />
          <p className="text-zinc-500 font-semibold text-lg">
            No classes linked yet
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            Your courses haven't been assigned to a class yet
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {uniqueClasses.map((classInfo, i) => (
            <ClassScheduleCard
              key={classInfo._id}
              classInfo={classInfo}
              teacherCourseIds={teacherCourseIds}
              index={i}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

const StatCard = ({ label, value, icon, bg }) => (
  <div className="bg-white border border-zinc-200 rounded-xl p-4">
    <div
      className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}
    >
      {icon}
    </div>
    <p className="text-xl font-bold text-zinc-900">{value}</p>
    <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
  </div>
);
