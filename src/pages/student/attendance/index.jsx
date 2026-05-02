import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LuChevronRight,
  LuInbox,
  LuCheck,
  LuX,
  LuCalendar,
  LuTrendingUp,
} from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";
import { DateTime } from "luxon";
import { axios } from "../../../lib/axios";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";

const fetchStudentClass = async () => {
  const { data } = await axios.get("/classes/my");
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

const ProgressRing = ({ percent, size = 80, stroke = 7 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const color =
    percent >= 75 ? "#16a34a" : percent >= 50 ? "#d97706" : "#dc2626";

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
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
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
      />
    </svg>
  );
};

const StatCard = ({ label, value, color, bg }) => (
  <div
    className={`flex flex-col items-center justify-center p-4 rounded-[10px] border ${bg}`}
  >
    <span className={`text-3xl font-bold ${color}`}>{value}</span>
    <span className="text-sm text-zinc-500 mt-1 font-medium">{label}</span>
  </div>
);

const RECORDS_PER_PAGE = 10;

const CourseAttendanceCard = ({ course }) => {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["student-attendance", course._id],
    queryFn: () => fetchCourseAttendance(course._id),
    staleTime: 2 * 60 * 1000,
  });

  const attendance = data?.data;

  const allRecords = attendance?.records ?? [];
  const totalPages = Math.ceil(allRecords.length / RECORDS_PER_PAGE);
  const paginatedRecords = allRecords.slice(
    (page - 1) * RECORDS_PER_PAGE,
    page * RECORDS_PER_PAGE,
  );

  const summary = attendance?.summary;
  const percentage = summary?.percentage ?? 0;
  const statusColor =
    percentage >= 75
      ? "text-green-600"
      : percentage >= 50
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="bg-white border border-zinc-200 rounded-[14px] overflow-hidden">
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between p-5 hover:bg-zinc-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <ProgressRing percent={percentage} />
            <span
              className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${statusColor}`}
            >
              {percentage}%
            </span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-zinc-900 text-base">
              {course.name}
            </p>
            {course.code && (
              <p className="text-sm text-zinc-500">{course.code}</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <ImSpinner8 className="animate-spin text-zinc-400" size={18} />
        ) : summary ? (
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span className="text-green-600 font-medium">
              {summary.present} Present
            </span>
            <span className="text-red-500 font-medium">
              {summary.absent} Absent
            </span>
            <span className="text-zinc-400">
              / {summary.totalClasses} Total
            </span>
          </div>
        ) : (
          <span className="text-sm text-zinc-400 italic">No records yet</span>
        )}
      </button>

      {expanded && (
        <div className="border-t border-zinc-100 p-5 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <ImSpinner8 size={28} className="animate-spin text-green-600" />
            </div>
          ) : !attendance ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LuInbox size={48} className="text-zinc-300 mb-2" />
              <p className="text-zinc-500 font-medium">No attendance records</p>
              <p className="text-zinc-400 text-sm mt-1">
                Your teacher hasn't marked attendance for this course yet
              </p>
            </div>
          ) : (
            <>
              <div
                className={`p-3 rounded-[10px] flex items-center gap-2 text-sm font-medium border
                  ${
                    percentage >= 75
                      ? "bg-green-50 border-green-200 text-green-700"
                      : percentage >= 50
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-red-50 border-red-200 text-red-700"
                  }`}
              >
                <LuTrendingUp size={15} />
                {percentage >= 75
                  ? `Good standing — ${percentage}% attendance`
                  : percentage >= 50
                    ? `Warning — ${percentage}% attendance. Minimum 75% required`
                    : `Critical — ${percentage}% attendance. You are at risk`}
              </div>

              {allRecords.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-zinc-700 mb-3 flex items-center gap-2">
                    <LuCalendar size={14} />
                    Attendance Log
                  </p>

                  <div className="border border-zinc-200 rounded-[10px] overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-zinc-50 border-b border-zinc-100">
                        <tr>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Day
                          </th>
                          <th className="px-4 py-2.5 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {paginatedRecords.map((record, i) => {
                          const dt = DateTime.fromISO(record.date);
                          return (
                            <tr
                              key={record.date}
                              className={
                                record.isPresent ? "bg-green-50/30" : ""
                              }
                            >
                              <td className="px-4 py-2.5 text-sm text-zinc-400 font-mono">
                                {(page - 1) * RECORDS_PER_PAGE + i + 1}
                              </td>
                              <td className="px-4 py-2.5 text-sm font-medium text-zinc-800">
                                {dt.toFormat("dd LLL yyyy")}
                              </td>
                              <td className="px-4 py-2.5 text-sm text-zinc-500">
                                {dt.toFormat("cccc")}
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                {record.isPresent ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full">
                                    <LuCheck size={11} strokeWidth={3} />
                                    Present
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full">
                                    <LuX size={11} strokeWidth={3} />
                                    Absent
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-3 text-sm text-zinc-500">
                      <span>
                        Page {page} of {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="px-3 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Prev
                        </button>
                        <button
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={page === totalPages}
                          className="px-3 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const StudentAttendance = () => {
  const { data: classData, isLoading } = useQuery({
    queryKey: ["student-class"],
    queryFn: fetchStudentClass,
    staleTime: 5 * 60 * 1000,
  });

  const courses = classData?.data?.courses ?? [];

  return (
    <Container>
      <div className="flex items-center gap-1 mb-6 text-sm text-zinc-500">
        <Link className="hover:text-zinc-900 transition-colors" to="/student">
          Student
        </Link>
        <LuChevronRight size={14} />
        <span className="text-zinc-900 font-medium">Attendence</span>
      </div>

      <div className="mb-8">
        <Heading className="mb-1">My Attendance</Heading>
        <Paragraph>
          {isLoading
            ? "Loading..."
            : `${courses.length} course${courses.length !== 1 ? "s" : ""} — click a course to expand`}
        </Paragraph>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <ImSpinner8 size={32} className="animate-spin text-green-600" />
          <p className="mt-3 text-zinc-500 text-sm">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <LuInbox size={56} className="text-zinc-300 mb-3" />
          <p className="text-zinc-500 font-semibold text-lg">
            Not enrolled in any class
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            Contact your administrator to be assigned to a class
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseAttendanceCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </Container>
  );
};
