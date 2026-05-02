import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import {
  LuBookOpen,
  LuUsers,
  LuClipboardList,
  LuClock,
  LuBell,
  LuChevronRight,
  LuCheck,
  LuX,
  LuCalendar,
  LuFileText,
  LuTrendingUp,
  LuCircleAlert,
  LuMapPin,
} from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";
import { useAuth } from "../../../hooks/useAuth";
import { axios } from "../../../lib/axios";
import { Container } from "../../../components/ui/Container";

// ── Data fetching ──────────────────────────────────────────────────────────────

const fetchTeacherCourses = async (teacherId) => {
  const { data } = await axios.get(`/courses?teacher=${teacherId}`);
  return data;
};

const fetchScheduleByClass = async (classId) => {
  try {
    const { data } = await axios.get(`/schedules/class/${classId}`);
    return data;
  } catch {
    return { data: null };
  }
};

const fetchNotices = async () => {
  const { data } = await axios.get("/notices");
  return data;
};

const fetchCourseResources = async (courseId, type) => {
  try {
    const { data } = await axios.get(
      `/resources/course/${courseId}?type=${type}`,
    );
    return data;
  } catch {
    return { resources: [] };
  }
};

const fetchSubmissions = async (assignmentId) => {
  try {
    const { data } = await axios.get(`/submissions/assignment/${assignmentId}`);
    return data;
  } catch {
    return { data: [] };
  }
};

const fetchAttendanceByCourse = async (courseId) => {
  try {
    const { data } = await axios.get(`/attendances/${courseId}/summary`);
    return data;
  } catch {
    return { data: null };
  }
};

// ── Constants ──────────────────────────────────────────────────────────────────

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
  { label: "Second Period", start: "08:30", end: "10:00" },
  { label: "Third Period", start: "10:00", end: "11:30" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const isCurrentSlot = (day, startTime, endTime) => {
  const now = new Date();
  if (DAYS[now.getDay()] !== day) return false;
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= sh * 60 + sm && cur < eh * 60 + em;
};

const getTodayClasses = (schedule, teacherCourseIds) => {
  if (!schedule?.timeTable) return [];
  const today = DAYS[new Date().getDay()];
  return schedule.timeTable
    .filter(
      (e) =>
        e.day === today && teacherCourseIds.includes(e.course?._id ?? e.course),
    )
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
};

// ── Live Clock ─────────────────────────────────────────────────────────────────

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="tabular-nums">
      {time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}
    </span>
  );
};

// ── Stat Card ──────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, sub, to, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Link
      to={to}
      className="group block bg-white border border-zinc-200 rounded-[14px] p-5 hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
    >
      <div
        className={`w-10 h-10 rounded-[10px] ${color} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <p className="text-3xl font-bold text-zinc-900 tabular-nums">{value}</p>
      <p className="text-sm text-zinc-500 mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </Link>
  </motion.div>
);

// ── Section wrapper ────────────────────────────────────────────────────────────

const Section = ({ title, icon, action, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-white border border-zinc-200 rounded-[14px] p-5"
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {action && (
        <Link
          to={action.to}
          className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-0.5 hover:underline"
        >
          {action.label}
          <LuChevronRight size={12} />
        </Link>
      )}
    </div>
    {children}
  </motion.div>
);

const EmptyMsg = ({ children }) => (
  <p className="text-sm text-zinc-400 italic text-center py-6">{children}</p>
);

// ── Today's Classes panel ─────────────────────────────────────────────────────

const TodayClasses = ({ courses }) => {
  const teacherCourseIds = courses.map((c) => c._id);

  const classMap = {};
  for (const c of courses) {
    if (c.class?._id) classMap[c.class._id] = c.class;
  }
  const uniqueClasses = Object.values(classMap);

  const scheduleQueries = uniqueClasses.map((cls) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ["schedule", cls._id],
      queryFn: () => fetchScheduleByClass(cls._id),
      staleTime: 5 * 60 * 1000,
    }),
  );

  const loading = scheduleQueries.some((q) => q.isLoading);

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <ImSpinner8 size={20} className="animate-spin text-green-600" />
      </div>
    );

  const todayEntries = [];
  for (let i = 0; i < uniqueClasses.length; i++) {
    const schedule = scheduleQueries[i].data?.data;
    const entries = getTodayClasses(schedule, teacherCourseIds);
    for (const e of entries) {
      todayEntries.push({ ...e, className: uniqueClasses[i].name });
    }
  }

  todayEntries.sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (!todayEntries.length)
    return <EmptyMsg>No classes scheduled for today</EmptyMsg>;

  return (
    <div className="space-y-2">
      {TIME_SLOTS.map((slot) => {
        const entry = todayEntries.find(
          (e) => e.startTime === slot.start && e.endTime === slot.end,
        );
        const current =
          entry &&
          isCurrentSlot(DAYS[new Date().getDay()], slot.start, slot.end);

        return (
          <div
            key={slot.label}
            className={`flex items-center gap-4 p-3 rounded-[10px] border transition-all
              ${
                current
                  ? "bg-green-600 border-green-700"
                  : entry
                    ? "bg-white border-zinc-200"
                    : "bg-zinc-50/60 border-dashed border-zinc-200 opacity-40"
              }`}
          >
            {/* Time */}
            <div className="shrink-0 w-16 text-center">
              <p
                className={`text-xs font-semibold ${current ? "text-green-100" : "text-zinc-500"}`}
              >
                {slot.start}
              </p>
              <p
                className={`text-xs ${current ? "text-green-200" : "text-zinc-400"}`}
              >
                {slot.end}
              </p>
            </div>
            <div
              className={`w-px self-stretch ${current ? "bg-green-400" : "bg-zinc-200"}`}
            />

            {entry ? (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className={`font-semibold text-sm ${current ? "text-white" : "text-zinc-900"}`}
                  >
                    {entry.course?.name}
                  </p>
                  {current && (
                    <span className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Now
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span
                    className={`text-xs flex items-center gap-1 ${current ? "text-green-100" : "text-zinc-400"}`}
                  >
                    <LuUsers size={10} /> {entry.className}
                  </span>
                  {entry.room && entry.room !== "TBD" && (
                    <span
                      className={`text-xs flex items-center gap-1 ${current ? "text-green-100" : "text-zinc-400"}`}
                    >
                      <LuMapPin size={10} /> {entry.room}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-400 italic">
                {slot.label} — free
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Pending Submissions panel ──────────────────────────────────────────────────

const PendingSubmissions = ({ courses }) => {
  const assignmentQueries = courses.map((c) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ["assignment", c._id],
      queryFn: () => fetchCourseResources(c._id, "assignment"),
      staleTime: 3 * 60 * 1000,
    }),
  );

  const loading = assignmentQueries.some((q) => q.isLoading);
  if (loading)
    return (
      <div className="flex justify-center py-8">
        <ImSpinner8 size={20} className="animate-spin text-green-600" />
      </div>
    );

  const now = DateTime.now();
  const activeAssignments = [];

  courses.forEach((c, i) => {
    const resources = assignmentQueries[i].data?.resources ?? [];
    resources.forEach((r) => {
      if (!r.deadline || DateTime.fromISO(r.deadline) >= now) {
        activeAssignments.push({
          ...r,
          courseName: c.name,
          courseCode: c.code,
        });
      }
    });
  });

  if (!activeAssignments.length)
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <LuCheck size={28} className="text-green-400 mb-2" />
        <p className="text-sm text-zinc-500 font-medium">All caught up!</p>
        <p className="text-xs text-zinc-400 mt-0.5">No active assignments</p>
      </div>
    );

  return (
    <div className="space-y-2">
      {activeAssignments.slice(0, 4).map((a) => {
        const dl = a.deadline ? DateTime.fromISO(a.deadline) : null;
        const diff = dl ? dl.diff(now, "days").days : null;
        const urgent = diff !== null && diff <= 1;
        const soon = diff !== null && diff <= 3;

        return (
          <div
            key={a._id}
            className={`flex items-start gap-3 p-3 rounded-[10px] border
              ${urgent ? "bg-red-50 border-red-200" : soon ? "bg-amber-50 border-amber-200" : "bg-zinc-50 border-zinc-200"}`}
          >
            <LuClipboardList
              size={14}
              className={`mt-0.5 shrink-0 ${urgent ? "text-red-500" : soon ? "text-amber-600" : "text-zinc-400"}`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">
                {a.title}
              </p>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                <BsFileEarmarkCodeFill size={10} />
                {a.courseCode ?? a.courseName}
              </p>
            </div>
            <div className="shrink-0 text-right">
              {dl ? (
                <>
                  <p
                    className={`text-xs font-semibold ${urgent ? "text-red-600" : soon ? "text-amber-600" : "text-zinc-500"}`}
                  >
                    {urgent ? "Due today" : `${Math.ceil(diff)}d left`}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {dl.toFormat("dd LLL")}
                  </p>
                </>
              ) : (
                <p className="text-xs text-zinc-400">No deadline</p>
              )}
            </div>
          </div>
        );
      })}
      {activeAssignments.length > 4 && (
        <p className="text-xs text-zinc-400 text-center pt-1">
          +{activeAssignments.length - 4} more assignments
        </p>
      )}
    </div>
  );
};

// ── Attendance Overview panel ──────────────────────────────────────────────────

const Ring = ({ pct, size = 44, stroke = 5 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct >= 75 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
  return (
    <svg
      width={size}
      height={size}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e4e4e7"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
};

const AttendanceOverview = ({ courses }) => {
  const queries = courses.map((c) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ["attendance-summary", c._id],
      queryFn: () => fetchAttendanceByCourse(c._id),
      staleTime: 5 * 60 * 1000,
    }),
  );

  const loading = queries.some((q) => q.isLoading);
  if (loading)
    return (
      <div className="flex justify-center py-8">
        <ImSpinner8 size={20} className="animate-spin text-green-600" />
      </div>
    );

  const rows = courses.map((c, i) => ({
    course: c,
    summary: queries[i].data?.data,
  }));

  const withData = rows.filter((r) => r.summary);

  if (!withData.length) return <EmptyMsg>No attendance recorded yet</EmptyMsg>;

  // Overall avg across all courses
  const avgPct = Math.round(
    withData.reduce((s, r) => {
      const totalClasses = r.summary?.totalClasses ?? 0;
      const presentAll =
        r.summary?.summary?.reduce((a, s) => a + s.present, 0) ?? 0;
      const totalPresent =
        totalClasses > 0
          ? (presentAll / (r.summary?.summary?.length || 1) / totalClasses) *
            100
          : 0;
      return s + totalPresent;
    }, 0) / withData.length,
  );

  return (
    <div className="space-y-3">
      {rows.map(({ course, summary }) => {
        if (!summary) {
          return (
            <div key={course._id} className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0 rounded-full bg-zinc-100 flex items-center justify-center">
                <span className="text-xs text-zinc-400">—</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 truncate">
                  {course.name}
                </p>
                <p className="text-xs text-zinc-400 italic">No records</p>
              </div>
            </div>
          );
        }

        const studentCount = summary.summary?.length ?? 0;
        const totalClasses = summary.totalClasses ?? 0;

        // Average attendance % across all students
        const avgStudentPct =
          studentCount > 0
            ? Math.round(
                summary.summary.reduce(
                  (s, st) => s + st.attendancePercentage,
                  0,
                ) / studentCount,
              )
            : 0;

        return (
          <div key={course._id} className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Ring pct={avgStudentPct} />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-700">
                {avgStudentPct}%
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-800 truncate">
                {course.name}
              </p>
              <p className="text-xs text-zinc-400">
                {studentCount} students · {totalClasses} classes held
              </p>
            </div>
            <span
              className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full
                ${
                  avgStudentPct >= 75
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : avgStudentPct >= 50
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                }`}
            >
              {avgStudentPct >= 75
                ? "Good"
                : avgStudentPct >= 50
                  ? "Fair"
                  : "Low"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Recent Notices ─────────────────────────────────────────────────────────────

const RecentNotices = ({ notices }) => {
  if (!notices.length) return <EmptyMsg>No notices yet</EmptyMsg>;

  const BADGE = {
    all: { label: "Everyone", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    student: {
      label: "Students",
      cls: "bg-purple-50 text-purple-700 border-purple-200",
    },
    teacher: {
      label: "Teachers",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };

  return (
    <div className="space-y-2">
      {notices.slice(0, 4).map((n) => {
        const badge = BADGE[n.targetRole] ?? BADGE.all;
        return (
          <div
            key={n._id}
            className="p-3 rounded-[10px] border border-zinc-200 bg-zinc-50 hover:border-zinc-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900 leading-snug line-clamp-1">
                {n.title}
              </p>
              <span
                className={`shrink-0 text-xs font-medium border px-2 py-0.5 rounded-full ${badge.cls}`}
              >
                {badge.label}
              </span>
            </div>
            {n.description && (
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                {n.description}
              </p>
            )}
            <p className="text-xs text-zinc-400 mt-1.5">
              {DateTime.fromISO(n.createdAt).toRelative()}
            </p>
          </div>
        );
      })}
    </div>
  );
};

// ── My Courses row ─────────────────────────────────────────────────────────────

const CourseChip = ({ course, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
  >
    <Link
      to={`/teacher/manage-resources/${course._id}`}
      className="group flex items-center gap-3 bg-white border border-zinc-200 rounded-[12px] p-4 hover:border-green-300 hover:shadow-sm transition-all duration-200"
    >
      <div className="w-9 h-9 rounded-[8px] bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
        <LuBookOpen size={16} className="text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 truncate group-hover:text-green-700 transition-colors">
          {course.name}
        </p>
        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
          <BsFileEarmarkCodeFill size={9} />
          {course.code}
          {course.class?.name && (
            <span className="ml-1">· {course.class.name}</span>
          )}
        </p>
      </div>
      <LuChevronRight
        size={14}
        className="text-zinc-300 group-hover:text-green-500 transition-colors shrink-0"
      />
    </Link>
  </motion.div>
);

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export const TeacherDashboard = () => {
  const { user } = useAuth();

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", "teacher", user?._id],
    queryFn: () => fetchTeacherCourses(user._id),
    enabled: !!user?._id,
    staleTime: 5 * 60 * 1000,
  });

  const { data: noticesData } = useQuery({
    queryKey: ["notices"],
    queryFn: fetchNotices,
    staleTime: 5 * 60 * 1000,
  });

  const courses = coursesData?.data ?? [];
  const notices = noticesData?.data ?? [];

  // Unique classes
  const classMap = {};
  for (const c of courses) {
    if (c.class?._id) classMap[c.class._id] = c.class;
  }
  const uniqueClasses = Object.values(classMap);

  // Count total students across all classes
  const totalStudents = uniqueClasses.reduce(
    (s, cls) => s + (cls.capacity ?? 0),
    0,
  );

  const today = DateTime.now().toFormat("cccc, dd LLLL yyyy");

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ImSpinner8 size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <Container>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-1">
              {greet()}, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-zinc-500 text-base flex items-center gap-2">
              <LuCalendar size={14} className="text-zinc-400" />
              {today}
            </p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-[12px] px-5 py-3 text-right">
            <p className="text-2xl font-bold text-zinc-900 tabular-nums">
              <LiveClock />
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">Local time</p>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<LuBookOpen size={18} className="text-green-600" />}
          label="Courses"
          value={courses.length}
          color="bg-green-50"
          to="/teacher/manage-resources"
          delay={0.05}
        />
        <StatCard
          icon={<LuUsers size={18} className="text-blue-600" />}
          label="Classes"
          value={uniqueClasses.length}
          color="bg-blue-50"
          to="/teacher/manage-attendance"
          delay={0.1}
        />
        <StatCard
          icon={<LuClipboardList size={18} className="text-orange-500" />}
          label="Today's classes"
          value={DAYS[new Date().getDay()]}
          color="bg-orange-50"
          to="/teacher/schedule"
          delay={0.15}
        />
        <StatCard
          icon={<LuBell size={18} className="text-amber-600" />}
          label="Notices"
          value={notices.length}
          color="bg-amber-50"
          to="/teacher/manage-notices"
          delay={0.2}
        />
      </div>

      {/* ── My Courses ── */}
      {courses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-700">My Courses</h2>
            <Link
              to="/teacher/manage-resources"
              className="text-xs text-green-600 hover:underline font-medium flex items-center gap-0.5"
            >
              All resources <LuChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {courses.map((c, i) => (
              <CourseChip key={c._id} course={c} index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's schedule */}
          <Section
            title="Today's Classes"
            icon={<LuClock size={15} className="text-green-600" />}
            action={{ label: "Full schedule", to: "/teacher/schedule" }}
            delay={0.35}
          >
            {courses.length === 0 ? (
              <EmptyMsg>No courses assigned yet</EmptyMsg>
            ) : (
              <TodayClasses courses={courses} />
            )}
          </Section>

          {/* Active assignments */}
          <Section
            title="Active Assignments"
            icon={<LuClipboardList size={15} className="text-orange-500" />}
            action={{
              label: "Manage resources",
              to: "/teacher/manage-resources",
            }}
            delay={0.4}
          >
            {courses.length === 0 ? (
              <EmptyMsg>No courses assigned yet</EmptyMsg>
            ) : (
              <PendingSubmissions courses={courses} />
            )}
          </Section>
        </div>

        {/* Right col */}
        <div className="space-y-6">
          {/* Attendance overview */}
          <Section
            title="Attendance Overview"
            icon={<LuTrendingUp size={15} className="text-blue-600" />}
            action={{ label: "Manage", to: "/teacher/manage-attendance" }}
            delay={0.45}
          >
            {courses.length === 0 ? (
              <EmptyMsg>No courses assigned yet</EmptyMsg>
            ) : (
              <AttendanceOverview courses={courses} />
            )}
          </Section>

          {/* Recent notices */}
          <Section
            title="Recent Notices"
            icon={<LuBell size={15} className="text-amber-500" />}
            action={{ label: "All notices", to: "/teacher/manage-notices" }}
            delay={0.5}
          >
            <RecentNotices notices={notices} />
          </Section>
        </div>
      </div>

      {/* ── Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center justify-between text-xs text-zinc-400"
      >
        <span>Last refreshed: {DateTime.now().toFormat("hh:mm a")}</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          System online
        </span>
      </motion.div>
    </Container>
  );
};
