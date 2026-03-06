import { useState } from "react";
import {
  LuUsers,
  LuBookOpen,
  LuGraduationCap,
  LuBuilding,
  LuCalendar,
  LuClock,
  LuChevronRight,
  LuBell,
  LuArrowRight,
  LuRefreshCw,
} from "react-icons/lu";

import { Link } from "react-router-dom";
import { Button } from "../../../components/Button";
import { StatCard } from "./StatCard";
import { Chart } from "./Chart";

const useDashboardData = () => {
  return {
    stats: {
      totalStudents: 1200,
      totalTeachers: 85,
      totalCourses: 45,
      totalClasses: 320,
      recentEnrollments: 48,
      pendingAssignments: 12,
    },
    recentNotices: [
      {
        id: 1,
        action: "New student enrolled",
        user: "John Doe",
        time: "2 hours ago",
        type: "enrollment",
      },
      {
        id: 2,
        action: "Course added",
        user: "Dr. Smith",
        time: "5 hours ago",
        type: "course",
      },
      {
        id: 3,
        action: "Class schedule updated",
        user: "Admin",
        time: "1 day ago",
        type: "schedule",
      },
      {
        id: 4,
        action: "Assignment submitted",
        user: "Sarah Johnson",
        time: "1 day ago",
        type: "assignment",
      },
      {
        id: 5,
        action: "New teacher joined",
        user: "Prof. Williams",
        time: "2 days ago",
        type: "teacher",
      },
    ],
    upcomingEvents: [
      { id: 1, title: "Faculty Meeting", date: "2024-03-25", time: "10:00 AM" },
      {
        id: 2,
        title: "Exam Board Review",
        date: "2024-03-26",
        time: "2:00 PM",
      },
      {
        id: 3,
        title: "Student Orientation",
        date: "2024-03-28",
        time: "9:00 AM",
      },
    ],
  };
};

export const AdminDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const data = useDashboardData();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-zinc-900">
                Admin Dashboard
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">
                Live
              </span>
            </div>
            <p className="text-zinc-500">
              Welcome back! Here's what's happening with your institution today.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <LuRefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={data.stats.totalStudents}
          icon={LuUsers}
          trend="+12%"
        />
        <StatCard
          title="Total Teachers"
          value={data.stats.totalTeachers}
          icon={LuGraduationCap}
          trend="+5%"
        />
        <StatCard
          title="Total Courses"
          value={data.stats.totalCourses}
          icon={LuBookOpen}
          trend="+8%"
        />
        <StatCard
          title="Total Classes"
          value={data.stats.totalClasses}
          icon={LuBuilding}
          trend="+15%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-zinc-300 rounded-[10px] p-6">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">
            Student Distribution
          </h2>
          <div className="h-110">
            <Chart />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-zinc-300 rounded-[10px] p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center justify-center gap-2 w-full"
              >
                <LuUsers size={18} />
                Add New Student
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center justify-center gap-2 w-full"
              >
                <LuBookOpen size={18} />
                Create New Course
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex items-center justify-center gap-2 w-full"
              >
                <LuCalendar size={18} />
                Schedule Class
              </Button>
            </div>
          </div>

          <div className="bg-white border border-zinc-300 rounded-[10px] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LuBell className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-zinc-900">
                  Notifications
                </h2>
                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
                  {data.recentNotices.length}
                </span>
              </div>
              <Link
                to="/admin/activities"
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 group"
              >
                View All
                <LuChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3">
              {data.recentNotices.slice(0, 4).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 last:border-0 last:pb-0 -mx-2 px-2"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === "enrollment"
                        ? "bg-green-50"
                        : activity.type === "course"
                          ? "bg-blue-50"
                          : activity.type === "teacher"
                            ? "bg-purple-50"
                            : "bg-zinc-50"
                    }`}
                  >
                    {activity.type === "enrollment" && (
                      <LuUsers className="w-4 h-4 text-green-600" />
                    )}
                    {activity.type === "course" && (
                      <LuBookOpen className="w-4 h-4 text-blue-600" />
                    )}
                    {activity.type === "teacher" && (
                      <LuGraduationCap className="w-4 h-4 text-purple-600" />
                    )}
                    {(activity.type === "schedule" ||
                      activity.type === "assignment") && (
                      <LuClock className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 line-clamp-1">
                      {activity.action}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
        <span>Last updated: {new Date().toLocaleString()}</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
          System is online
        </span>
      </div>
    </div>
  );
};
