/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import {
  LuUsers,
  LuBookOpen,
  LuGraduationCap,
  LuBuilding,
  LuMessageCircleMore,
  LuTrendingUp,
  LuRefreshCw,
  LuCircleAlert,
} from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";
import { axios } from "../../../lib/axios";
import { useAuth } from "../../../hooks/useAuth";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";

const fetchDashboardData = async () => {
  const [students, teachers, admins, courses, classes, notices] =
    await Promise.all([
      axios.get("/users?role=student").then((r) => r.data),
      axios.get("/users?role=teacher").then((r) => r.data),
      axios.get("/users?role=admin").then((r) => r.data),
      axios.get("/courses").then((r) => r.data),
      axios.get("/classes").then((r) => r.data),
      axios.get("/notices").then((r) => r.data),
    ]);
  return { students, teachers, admins, courses, classes, notices };
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

const EnrollmentBar = ({ cls }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const enrolled = cls.students?.length || 0;
  const capacity = cls.capacity || 35;
  const pct = Math.min((enrolled / capacity) * 100, 100);
  const barColor =
    pct > 85 ? "bg-red-500" : pct > 60 ? "bg-yellow-500" : "bg-green-600";

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <Link
          to={`/admin/manage-classes/${cls._id}`}
          className="text-sm font-medium text-zinc-900 hover:underline"
        >
          {cls.name}
        </Link>
        <span className="text-xs text-zinc-500">
          {enrolled} / {capacity}
        </span>
      </div>
      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: animated ? `${pct}%` : "0%" }}
        />
      </div>
    </div>
  );
};

const CourseRow = ({ course, index }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-zinc-100 last:border-0">
    <span className="text-sm text-zinc-400 w-5 shrink-0">{index + 1}.</span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-zinc-900 truncate">
        {course.name}
      </p>
      <p className="text-xs text-zinc-500">{course.code}</p>
    </div>
    {course.teacher ? (
      <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full shrink-0">
        {course.teacher.name}
      </span>
    ) : (
      <span className="text-xs text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
        <LuCircleAlert size={10} />
        Unassigned
      </span>
    )}
  </div>
);

const NoticeRow = ({ notice }) => {
  const badge = {
    all: { label: "Everyone", cls: "bg-blue-50 text-blue-600 border-blue-200" },
    student: {
      label: "Students",
      cls: "bg-purple-50 text-purple-600 border-purple-200",
    },
    teacher: {
      label: "Teachers",
      cls: "bg-amber-50 text-amber-600 border-amber-200",
    },
  }[notice.targetRole] ?? {
    label: notice.targetRole,
    cls: "bg-zinc-100 text-zinc-500 border-zinc-200",
  };

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">
          {notice.title}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {notice.postedBy?.name} ·{" "}
          {DateTime.fromISO(notice.createdAt).toRelative()}
        </p>
      </div>
      <span
        className={`text-xs font-medium border px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}
      >
        {badge.label}
      </span>
    </div>
  );
};

const Skeleton = ({ rows = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-zinc-100 rounded animate-pulse"
        style={{ width: `${50 + (i % 3) * 15}%` }}
      />
    ))}
  </div>
);

const SectionCard = ({
  title,
  sub,
  to,
  linkLabel,
  children,
  isLoading,
  empty,
}) => (
  <div className="bg-white border border-zinc-300 rounded-[10px] p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
        {sub && <p className="text-sm text-zinc-500 mt-0.5">{sub}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
        >
          {linkLabel || "View all"}
        </Link>
      )}
    </div>
    {isLoading ? (
      <Skeleton />
    ) : empty ? (
      <p className="text-sm text-zinc-400 italic py-4 text-center">{empty}</p>
    ) : (
      children
    )}
  </div>
);

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["admin-dashboard", refreshKey],
    queryFn: fetchDashboardData,
    staleTime: 2 * 60 * 1000,
  });

  const students = data?.students?.data || [];
  const teachers = data?.teachers?.data || [];
  const admins = data?.admins?.data || [];
  const courses = data?.courses?.data || [];
  const classes = data?.classes?.data || [];
  const notices = data?.notices?.data || [];

  const activeStudents = students.filter((s) => s.isActive).length;
  const activeTeachers = teachers.filter((t) => t.isActive).length;
  const unassignedCourses = courses.filter((c) => !c.teacher).length;
  const totalEnrolled = classes.reduce(
    (s, c) => s + (c.students?.length || 0),
    0,
  );
  const totalCapacity = classes.reduce((s, c) => s + (c.capacity || 0), 0);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Container>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Heading>Admin Dashboard</Heading>
            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full border border-green-200">
              Live
            </span>
          </div>
          <Paragraph>
            {greet()}, {user?.name}. Here's what's happening today.
          </Paragraph>
        </div>
        <div className="flex items-center gap-2">
          {dataUpdatedAt > 0 && (
            <span className="text-xs text-zinc-400">
              Updated {DateTime.fromMillis(dataUpdatedAt).toRelative()}
            </span>
          )}
          <button
            onClick={() => {
              setRefreshKey((k) => k + 1);
              refetch();
            }}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <LuRefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={LuUsers}
          sub={`${activeStudents} active`}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          icon={LuGraduationCap}
          sub={`${activeTeachers} active`}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Courses"
          value={courses.length}
          icon={LuBookOpen}
          sub={`${unassignedCourses} unassigned`}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Classes"
          value={classes.length}
          icon={LuBuilding}
          sub={`${totalEnrolled} enrolled`}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SectionCard
          title="Class Enrollment"
          sub={`${totalEnrolled} / ${totalCapacity} seats filled`}
          to="/admin/manage-classes"
          isLoading={isLoading}
          empty={classes.length === 0 ? "No classes yet" : null}
        >
          {classes.slice(0, 6).map((cls) => (
            <EnrollmentBar key={cls._id} cls={cls} />
          ))}
          {classes.length > 6 && (
            <Link
              to="/admin/manage-classes"
              className="block text-xs text-center text-green-600 hover:underline mt-3"
            >
              +{classes.length - 6} more classes
            </Link>
          )}
        </SectionCard>

        <SectionCard
          title="Courses"
          sub={
            unassignedCourses > 0
              ? `${unassignedCourses} need a teacher`
              : "All courses staffed"
          }
          to="/admin/manage-courses"
          isLoading={isLoading}
          empty={courses.length === 0 ? "No courses yet" : null}
        >
          {courses.slice(0, 7).map((c, i) => (
            <CourseRow key={c._id} course={c} index={i} />
          ))}
          {courses.length > 7 && (
            <Link
              to="/admin/manage-courses"
              className="block text-xs text-center text-green-600 hover:underline mt-3"
            >
              +{courses.length - 7} more courses
            </Link>
          )}
        </SectionCard>

        <div className="flex flex-col gap-6">
          <SectionCard
            title="User Summary"
            sub="Across all roles"
            to="/admin/manage-students"
            isLoading={isLoading}
          >
            {[
              {
                label: "Active students",
                value: activeStudents,
                total: students.length,
                color: "bg-blue-500",
              },
              {
                label: "Active teachers",
                value: activeTeachers,
                total: teachers.length,
                color: "bg-purple-500",
              },
              {
                label: "Courses staffed",
                value: courses.length - unassignedCourses,
                total: courses.length,
                color: "bg-green-600",
              },
            ].map(({ label, value, total, color }) => {
              const pct = total ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-600">{label}</span>
                    <span className="text-zinc-500 font-medium">
                      {value}/{total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{
                        width: `${pct}%`,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </SectionCard>

          <SectionCard title="Quick Links" isLoading={false}>
            {[
              {
                label: "Manage Students",
                to: "/admin/manage-students",
                icon: LuUsers,
              },
              {
                label: "Manage Teachers",
                to: "/admin/manage-teachers",
                icon: LuGraduationCap,
              },
              {
                label: "Manage Courses",
                to: "/admin/manage-courses",
                icon: LuBookOpen,
              },
              {
                label: "Manage Classes",
                to: "/admin/manage-classes",
                icon: LuBuilding,
              },
              {
                label: "Notices",
                to: "/admin/manage-notices",
                icon: LuMessageCircleMore,
              },
            ].map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 py-2 text-zinc-700 hover:text-green-600 transition-colors border-b border-zinc-100 last:border-0 text-sm"
              >
                <Icon size={15} className="shrink-0" />
                {label}
                <span className="ml-auto text-zinc-400">›</span>
              </Link>
            ))}
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Recent Notices"
          sub={`${notices.length} published`}
          to="/admin/manage-notices"
          isLoading={isLoading}
          empty={notices.length === 0 ? "No notices yet" : null}
        >
          {notices.slice(0, 6).map((n) => (
            <NoticeRow key={n._id} notice={n} />
          ))}
        </SectionCard>

        <SectionCard
          title="Teaching Staff"
          sub={`${activeTeachers} active · ${teachers.length - activeTeachers} inactive`}
          to="/admin/manage-teachers"
          isLoading={isLoading}
          empty={teachers.length === 0 ? "No teachers yet" : null}
        >
          {teachers.slice(0, 6).map((t) => {
            const hue =
              (t._id?.charCodeAt(0) * 37 + (t._id?.charCodeAt(2) || 0) * 13) %
              360;
            const initials = t.name
              ?.split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            return (
              <div
                key={t._id}
                className="flex items-center gap-3 py-2.5 border-b border-zinc-100 last:border-0"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: `hsl(${hue},55%,52%)` }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{t.email}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${t.isActive ? "bg-green-50 text-green-600 border-green-200" : "bg-zinc-100 text-zinc-400 border-zinc-200"}`}
                >
                  {t.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            );
          })}
          {teachers.length > 6 && (
            <Link
              to="/admin/manage-teachers"
              className="block text-xs text-center text-green-600 hover:underline mt-3"
            >
              +{teachers.length - 6} more teachers
            </Link>
          )}
        </SectionCard>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-zinc-400">
        <span>
          Last updated:{" "}
          {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString() : "—"}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
          System online
        </span>
      </div>
    </Container>
  );
};
