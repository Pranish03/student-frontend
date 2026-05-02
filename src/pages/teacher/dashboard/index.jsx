/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import {
  LuBookOpen,
  LuUsers,
  LuClipboardList,
  LuClock,
  LuBell,
  LuChevronRight,
  LuCheck,
  LuCalendar,
  LuTrendingUp,
  LuMapPin,
} from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";
import { useAuth } from "../../../hooks/useAuth";
import { axios } from "../../../lib/axios";
import { Container } from "../../../components/ui/Container";

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

const fetchAttendanceByCourse = async (courseId) => {
  try {
    const { data } = await axios.get(`/attendances/${courseId}/summary`);
    return data;
  } catch {
    return { data: null };
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

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!value) return;
    let start = null;
    const duration = 900;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return <>{display.toLocaleString()}</>;
};

const StatCard = ({ title, value, icon: Icon, sub, isLoading }) => (
  <div className="bg-white border border-zinc-300 rounded-[10px] p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-zinc-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-zinc-900">
          {isLoading ? (
            <span className="inline-block w-12 h-8 bg-zinc-100 rounded animate-pulse" />
          ) : (
            <AnimatedNumber value={value} />
          )}
        </p>
        {sub && !isLoading && (
          <p className="text-xs text-zinc-500 mt-1">{sub}</p>
        )}
      </div>
      <div className="p-3 bg-green-50 rounded-lg">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
    </div>
    {!isLoading && (
      <div className="mt-3 flex items-center gap-1 text-xs">
        <LuTrendingUp className="w-3 h-3 text-green-600" />
        <span className="text-green-600 font-medium">{sub}</span>
      </div>
    )}
  </div>
);

const Section = ({ title, icon, action, children }) => (
  <div className="bg-white border border-zinc-200 rounded-[10px] p-5">
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
  </div>
);

const EmptyMsg = ({ children }) => (
  <p className="text-sm text-zinc-400 italic text-center py-6">{children}</p>
);

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

const CourseChip = ({ course }) => (
  <Link
    to={`/teacher/manage-resources/${course._id}`}
    className="group flex items-center gap-3 bg-white border border-zinc-200 rounded-[10px] p-4"
  >
    <div className="w-9 h-9 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
      <LuBookOpen size={16} className="text-green-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-zinc-900 truncate">
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
);

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

  const classMap = {};
  for (const c of courses) {
    if (c.class?._id) classMap[c.class._id] = c.class;
  }
  const uniqueClasses = Object.values(classMap);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-1">
          {greet()}, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-zinc-500 text-base flex items-center gap-2">
          <LuCalendar size={14} className="text-zinc-400" />
          {today}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Courses"
          value={courses.length}
          icon={LuBookOpen}
          sub={`${courses.length} assigned`}
          isLoading={coursesLoading}
        />
        <StatCard
          title="Total Classes"
          value={uniqueClasses.length}
          icon={LuUsers}
          sub={`${uniqueClasses.length} active`}
          isLoading={coursesLoading}
        />
        <StatCard
          title="Today"
          value={DAYS[new Date().getDay()].length}
          icon={LuClock}
          sub={DAYS[new Date().getDay()]}
          isLoading={coursesLoading}
        />
        <StatCard
          title="Notices"
          value={notices.length}
          icon={LuBell}
          sub="announcements"
          isLoading={coursesLoading}
        />
      </div>

      {courses.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-700">Resources</h2>
            <Link
              to="/teacher/manage-resources"
              className="text-xs text-green-600 hover:underline font-medium flex items-center gap-0.5"
            >
              All resources <LuChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {courses.map((c) => (
              <CourseChip key={c._id} course={c} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section
            title="Today's Classes"
            icon={<LuClock size={15} className="text-green-600" />}
            action={{ label: "Full schedule", to: "/teacher/schedule" }}
          >
            {courses.length === 0 ? (
              <EmptyMsg>No courses assigned yet</EmptyMsg>
            ) : (
              <TodayClasses courses={courses} />
            )}
          </Section>

          <Section
            title="Active Assignments"
            icon={<LuClipboardList size={15} className="text-orange-500" />}
            action={{
              label: "Manage resources",
              to: "/teacher/manage-resources",
            }}
          >
            {courses.length === 0 ? (
              <EmptyMsg>No courses assigned yet</EmptyMsg>
            ) : (
              <PendingSubmissions courses={courses} />
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section
            title="Attendance Overview"
            icon={<LuTrendingUp size={15} className="text-blue-600" />}
            action={{ label: "Manage", to: "/teacher/manage-attendance" }}
          >
            {courses.length === 0 ? (
              <EmptyMsg>No courses assigned yet</EmptyMsg>
            ) : (
              <AttendanceOverview courses={courses} />
            )}
          </Section>

          <Section
            title="Recent Notices"
            icon={<LuBell size={15} className="text-amber-500" />}
            action={{ label: "All notices", to: "/teacher/manage-notices" }}
          >
            <RecentNotices notices={notices} />
          </Section>
        </div>
      </div>
    </Container>
  );
};
