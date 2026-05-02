import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import {
  LuBookOpen,
  LuClipboardList,
  LuClock,
  LuCalendar,
  LuChevronRight,
  LuCheck,
  LuX,
  LuCircleAlert,
  LuBell,
} from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { useAuth } from "../../../hooks/useAuth";
import { axios } from "../../../lib/axios";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";

const fetchStudentClass = async () => {
  const { data } = await axios.get("/classes/my");
  return data;
};

const fetchScheduleByClass = async (classId) => {
  const { data } = await axios.get(`/schedules/class/${classId}`);
  return data;
};

const fetchNotices = async () => {
  const { data } = await axios.get("/notices");
  return data;
};

const fetchCourseAttendance = async (courseId) => {
  try {
    const { data } = await axios.get(`/attendances/my/${courseId}`);
    return data;
  } catch (err) {
    if (err.response?.status === 404) return { data: null };
    throw err;
  }
};

const fetchCourseAssignments = async (courseId) => {
  try {
    const { data } = await axios.get(
      `/resources/course/${courseId}?type=assignment`,
    );
    return data;
  } catch {
    return { resources: [] };
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
  { label: "Second Period", start: "08:30", end: "10:00" },
  { label: "Third Period", start: "10:00", end: "11:30" },
];

const isCurrentSlot = (day, startTime, endTime) => {
  const now = new Date();
  if (DAYS[now.getDay()] !== day) return false;
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= sh * 60 + sm && cur < eh * 60 + em;
};

const getTodayClasses = (schedule) => {
  if (!schedule?.timeTable) return [];
  const today = DAYS[new Date().getDay()];
  return schedule.timeTable
    .filter((e) => e.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
};

// ── Mini attendance ring ──────────────────────────────────────────────────────
const Ring = ({ pct, size = 36, stroke = 4 }) => {
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
      />
    </svg>
  );
};

// ── Attendance summary across all courses ─────────────────────────────────────
const AttendanceSummary = ({ courses }) => {
  const queries = courses.map((c) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ["student-attendance", c._id],
      queryFn: () => fetchCourseAttendance(c._id),
      staleTime: 5 * 60 * 1000,
    }),
  );

  const loading = queries.some((q) => q.isLoading);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <ImSpinner8 className="animate-spin text-green-600" size={22} />
      </div>
    );
  }

  const rows = courses.map((c, i) => {
    const att = queries[i].data?.data;
    const pct = att?.summary?.percentage ?? null;
    return { course: c, att, pct };
  });

  const withData = rows.filter((r) => r.att);

  if (!withData.length) {
    return (
      <p className="text-sm text-zinc-400 italic py-4 text-center">
        No attendance records yet
      </p>
    );
  }

  // Overall average
  const avg = Math.round(
    withData.reduce((s, r) => s + r.pct, 0) / withData.length,
  );

  return (
    <div>
      {/* Overall */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-zinc-50 border border-zinc-200 rounded-[10px]">
        <div className="relative">
          <Ring pct={avg} size={48} stroke={5} />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zinc-700">
            {avg}%
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-800">
            Overall attendance
          </p>
          <p
            className={`text-xs font-medium mt-0.5 ${avg >= 75 ? "text-green-600" : avg >= 50 ? "text-amber-600" : "text-red-500"}`}
          >
            {avg >= 75
              ? "Good standing"
              : avg >= 50
                ? "Needs improvement"
                : "At risk"}
          </p>
        </div>
      </div>

      {/* Per-course rows */}
      <div className="space-y-2">
        {rows.map(({ course, att, pct }) => (
          <div key={course._id} className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Ring pct={pct ?? 0} size={34} stroke={3} />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-zinc-600">
                {pct ?? "–"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-800 truncate">
                {course.name}
              </p>
              {att ? (
                <p className="text-xs text-zinc-400">
                  {att.summary.present}P · {att.summary.absent}A ·{" "}
                  {att.summary.totalClasses} classes
                </p>
              ) : (
                <p className="text-xs text-zinc-400 italic">No records</p>
              )}
            </div>
            {pct !== null && (
              <span
                className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full
                ${
                  pct >= 75
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : pct >= 50
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {pct}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Pending assignments across all courses ────────────────────────────────────
const PendingAssignments = ({ courses }) => {
  const queries = courses.map((c) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQuery({
      queryKey: ["student-assignments", c._id],
      queryFn: () => fetchCourseAssignments(c._id),
      staleTime: 5 * 60 * 1000,
    }),
  );

  const loading = queries.some((q) => q.isLoading);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <ImSpinner8 className="animate-spin text-green-600" size={22} />
      </div>
    );
  }

  const now = DateTime.now();
  const pending = [];

  courses.forEach((c, i) => {
    const resources = queries[i].data?.resources ?? [];
    resources.forEach((r) => {
      if (!r.deadline) return;
      const dl = DateTime.fromISO(r.deadline);
      if (dl >= now) {
        pending.push({
          ...r,
          courseName: c.name,
          courseCode: c.code,
          deadline: dl,
        });
      }
    });
  });

  pending.sort((a, b) => a.deadline - b.deadline);

  if (!pending.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <LuCheck size={32} className="text-green-400 mb-2" />
        <p className="text-sm text-zinc-500 font-medium">All caught up!</p>
        <p className="text-xs text-zinc-400 mt-0.5">No pending assignments</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pending.slice(0, 5).map((a) => {
        const diff = a.deadline.diff(now, "days").days;
        const urgent = diff <= 1;
        const soon = diff <= 3;
        return (
          <div
            key={a._id}
            className={`flex items-start gap-3 p-3 rounded-[10px] border
              ${urgent ? "bg-red-50 border-red-200" : soon ? "bg-amber-50 border-amber-200" : "bg-zinc-50 border-zinc-200"}`}
          >
            <LuClipboardList
              size={15}
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
              <p
                className={`text-xs font-semibold ${urgent ? "text-red-600" : soon ? "text-amber-600" : "text-zinc-500"}`}
              >
                {urgent ? "Due today" : `${Math.ceil(diff)}d left`}
              </p>
              <p className="text-xs text-zinc-400">
                {a.deadline.toFormat("dd LLL")}
              </p>
            </div>
          </div>
        );
      })}
      {pending.length > 5 && (
        <p className="text-xs text-zinc-400 text-center pt-1">
          +{pending.length - 5} more assignments
        </p>
      )}
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
export const StudentDashboard = () => {
  const { user } = useAuth();

  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["student-class"],
    queryFn: fetchStudentClass,
    staleTime: 5 * 60 * 1000,
  });

  const classInfo = classData?.data;
  const classId = classInfo?._id;
  const courses = classInfo?.courses ?? [];

  const { data: scheduleData } = useQuery({
    queryKey: ["student-schedule", classId],
    queryFn: () => fetchScheduleByClass(classId),
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: noticesData } = useQuery({
    queryKey: ["notices"],
    queryFn: fetchNotices,
    staleTime: 5 * 60 * 1000,
  });

  const schedule = scheduleData?.data;
  const todayClasses = getTodayClasses(schedule);
  const notices = (noticesData?.data ?? []).slice(0, 4);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  if (classLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ImSpinner8 size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <Container>
      <div className="mb-8">
        <Heading className="mb-1">
          {greet()}, {user?.name?.split(" ")[0]}
        </Heading>
        <p className="text-zinc-500 text-base">
          {DateTime.now().toFormat("cccc, dd LLLL yyyy")}
          {classInfo && (
            <span className="ml-2 text-zinc-400">· {classInfo.name}</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<LuBookOpen size={18} className="text-blue-600" />}
          label="Courses"
          value={courses.length}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<LuClipboardList size={18} className="text-orange-500" />}
          label="Today's classes"
          value={todayClasses.length}
          bg="bg-orange-50"
        />
        <StatCard
          icon={<LuCalendar size={18} className="text-violet-600" />}
          label="Academic year"
          value={classInfo?.academicYear ?? "—"}
          bg="bg-violet-50"
        />
        <StatCard
          icon={<LuBell size={18} className="text-green-600" />}
          label="Notices"
          value={noticesData?.data?.length ?? 0}
          bg="bg-green-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section
            title="Today's classes"
            icon={<LuClock size={16} className="text-green-600" />}
            action={{ label: "Full schedule", to: "/student/manage-schedule" }}
          >
            {!classId ? (
              <EmptyMsg>Not enrolled in any class</EmptyMsg>
            ) : !schedule ? (
              <EmptyMsg>No schedule set up yet</EmptyMsg>
            ) : todayClasses.length === 0 ? (
              <EmptyMsg>No classes today — enjoy your day!</EmptyMsg>
            ) : (
              <div className="space-y-2">
                {TIME_SLOTS.map((slot) => {
                  const entry = todayClasses.find(
                    (e) => e.startTime === slot.start && e.endTime === slot.end,
                  );
                  const current =
                    entry &&
                    isCurrentSlot(
                      DAYS[new Date().getDay()],
                      slot.start,
                      slot.end,
                    );

                  return (
                    <div
                      key={slot.label}
                      className={`flex items-center gap-4 p-3 rounded-[10px] border transition-all
                        ${
                          current
                            ? "bg-green-600 border-green-700"
                            : entry
                              ? "bg-white border-zinc-200"
                              : "bg-zinc-50/60 border-dashed border-zinc-200 opacity-50"
                        }`}
                    >
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
                            {entry.course?.code && (
                              <span
                                className={`text-xs flex items-center gap-1 ${current ? "text-green-100" : "text-zinc-400"}`}
                              >
                                <BsFileEarmarkCodeFill size={10} />
                                {entry.course.code}
                              </span>
                            )}
                            {entry.room && entry.room !== "TBD" && (
                              <span
                                className={`text-xs ${current ? "text-green-100" : "text-zinc-400"}`}
                              >
                                Room {entry.room}
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
            )}
          </Section>

          <Section
            title="Pending assignments"
            icon={<LuClipboardList size={16} className="text-orange-500" />}
            action={{ label: "All courses", to: "/student/manage-courses" }}
          >
            {!classId ? (
              <EmptyMsg>Not enrolled in any class</EmptyMsg>
            ) : courses.length === 0 ? (
              <EmptyMsg>No courses assigned yet</EmptyMsg>
            ) : (
              <PendingAssignments courses={courses} />
            )}
          </Section>
        </div>

        {/* Right col — Attendance + Notices */}
        <div className="space-y-6">
          {/* Attendance */}
          <Section
            title="Attendance"
            icon={<LuCheck size={16} className="text-green-600" />}
            action={{ label: "Details", to: "/student/manage-attendance" }}
          >
            {!classId ? (
              <EmptyMsg>Not enrolled in any class</EmptyMsg>
            ) : courses.length === 0 ? (
              <EmptyMsg>No courses yet</EmptyMsg>
            ) : (
              <AttendanceSummary courses={courses} />
            )}
          </Section>

          <Section
            title="Recent notices"
            icon={<LuBell size={16} className="text-amber-500" />}
            action={{ label: "All notices", to: "/student/manage-notices" }}
          >
            {notices.length === 0 ? (
              <EmptyMsg>No notices yet</EmptyMsg>
            ) : (
              <div className="space-y-2">
                {notices.map((n) => (
                  <div
                    key={n._id}
                    className="p-3 rounded-[10px] border border-zinc-200 bg-zinc-50 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-zinc-900 leading-snug line-clamp-1">
                        {n.title}
                      </p>
                      <span
                        className={`shrink-0 text-xs font-medium border px-2 py-0.5 rounded-full
                        ${
                          n.targetRole === "student"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : n.targetRole === "teacher"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {n.targetRole === "all"
                          ? "Everyone"
                          : n.targetRole === "student"
                            ? "Students"
                            : "Teachers"}
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
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
    </Container>
  );
};

const StatCard = ({ icon, label, value, bg }) => (
  <div className="group bg-white border border-zinc-200 rounded-xl p-4 block">
    <div
      className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}
    >
      {icon}
    </div>
    <p className="text-2xl font-bold text-zinc-900">{value}</p>
    <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
  </div>
);

const Section = ({ title, icon, action, children }) => (
  <div className="bg-white border border-zinc-200 rounded-[14px] p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
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
  </div>
);

const EmptyMsg = ({ children }) => (
  <p className="text-sm text-zinc-400 italic text-center py-6">{children}</p>
);
