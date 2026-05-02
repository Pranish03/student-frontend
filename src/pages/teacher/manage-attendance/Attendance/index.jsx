import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchClass } from "../../../../api/manageClasses";
import { useCourse } from "../../../../hooks/useCourse";
import {
  fetchAttendanceByCourseAndDate,
  createAttendance,
  updateAttendance,
} from "../../../../api/attendence";
import { format } from "date-fns";
import {
  LuChevronRight,
  LuChevronLeft,
  LuChevronRight as LuChevronRightIcon,
  LuPencil,
  LuCheck,
  LuX,
  LuCalendar,
  LuUsers,
  LuSave,
} from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";
import { Container } from "../../../../components/ui/Container";
import { Button } from "../../../../components/Button";
import { Alert } from "../../../../components/ui/Alert";
import {
  isFutureDateLocal,
  isTodayLocal,
  parseLocalDate,
} from "../../../../utils/formatDate";
import { Heading } from "../../../../components/ui/Heading";
import { Paragraph } from "../../../../components/ui/Paragraph";
import { BsFileEarmarkCodeFill } from "react-icons/bs";

const stepDate = (dateStr, days) => {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return format(d, "yyyy-MM-dd");
};

const formatDisplayDate = (dateStr) => {
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ProgressRing = ({ percent, size = 72, stroke = 6 }) => {
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
        style={{ transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease" }}
      />
    </svg>
  );
};

const StatPill = ({ label, value, color }) => (
  <div className="flex flex-col items-center justify-center px-5 py-3 rounded-[10px] bg-zinc-50 border border-zinc-200 min-w-20">
    <span className="text-2xl font-bold" style={{ color }}>
      {value}
    </span>
    <span className="text-xs text-zinc-500 mt-0.5 font-medium">{label}</span>
  </div>
);

const StudentRow = ({ record, index, isEditing, canEdit, onChange }) => {
  const present = record.isPresent;

  return (
    <tr
      className={`
        border-b border-zinc-100 last:border-0 transition-colors duration-150
        ${isEditing && canEdit ? "cursor-pointer hover:bg-zinc-50/80" : ""}
        ${isEditing && present ? "bg-green-50/40" : ""}
        ${isEditing && !present ? "bg-red-50/20" : ""}
      `}
      onClick={() => {
        if (isEditing && canEdit) onChange(record.student, !present);
      }}
    >
      <td className="px-5 py-3.5 w-14">
        {isEditing && canEdit ? (
          <div
            className={`
              w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-150
              ${
                present
                  ? "bg-green-600 border-green-600"
                  : "bg-white border-zinc-300"
              }
            `}
          >
            {present && (
              <LuCheck size={13} className="text-white" strokeWidth={3} />
            )}
          </div>
        ) : (
          <div
            className={`
              w-2.5 h-2.5 rounded-full mx-auto
              ${present ? "bg-green-500" : "bg-red-400"}
            `}
          />
        )}
      </td>

      <td className="px-4 py-3.5 text-sm text-zinc-400 font-mono w-12">
        {index + 1}
      </td>

      <td className="px-4 py-3.5">
        <span className="font-medium text-zinc-900 text-sm">
          {record.studentName}
        </span>
      </td>

      <td className="px-4 py-3.5 text-sm text-zinc-500 hidden sm:table-cell">
        {record.studentEmail}
      </td>

      <td className="px-5 py-3.5 text-right">
        {isEditing && canEdit ? (
          <span
            className={`
              inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border
              ${
                present
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-zinc-100 text-zinc-500 border-zinc-200"
              }
            `}
          >
            {present ? (
              <>
                <LuCheck size={11} strokeWidth={3} /> Present
              </>
            ) : (
              <>
                <LuX size={11} strokeWidth={3} /> Absent
              </>
            )}
          </span>
        ) : (
          <span
            className={`
              inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border
              ${
                present
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }
            `}
          >
            {present ? (
              <>
                <LuCheck size={11} strokeWidth={3} /> Present
              </>
            ) : (
              <>
                <LuX size={11} strokeWidth={3} /> Absent
              </>
            )}
          </span>
        )}
      </td>
    </tr>
  );
};

export const Attendance = () => {
  const { id: courseId } = useParams();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [localAttendance, setLocalAttendance] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFutureDate = isFutureDateLocal(selectedDate);
  const isTodayDate = isTodayLocal(selectedDate);
  const canEdit = isTodayDate && !isFutureDate;

  const { data: courseData, isLoading: courseLoading } = useCourse(courseId);
  const classId = courseData?.data?.class;

  const {
    data: classData,
    isLoading: classLoading,
    error: classError,
  } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => fetchClass(classId),
    enabled: !!classId,
  });

  const { data: attendanceQueryData, isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendance", courseId, selectedDate],
    queryFn: () => fetchAttendanceByCourseAndDate(courseId, selectedDate),
    enabled: !!courseId && !!selectedDate && !!classId,
    retry: false,
    throwOnError: false,
  });

  const isNotFound =
    !attendanceQueryData?.data || attendanceQueryData?.data?.length === 0;

  const existingRecord =
    !isNotFound && attendanceQueryData?.data?.[0]
      ? attendanceQueryData.data[0]
      : null;
  const existingAttendanceId = existingRecord?._id ?? null;

  const serverAttendance = existingRecord
    ? existingRecord.attendance.map((r) => ({
        student: r.student._id,
        isPresent: r.isPresent,
        studentName: r.student.name,
        studentEmail: r.student.email,
      }))
    : [];

  const initialAttendance =
    classData?.data?.students?.map((s) => ({
      student: s._id,
      isPresent: false,
      studentName: s.name,
      studentEmail: s.email,
    })) ?? [];

  const attendanceData = isEditing
    ? localAttendance
    : existingAttendanceId
      ? serverAttendance
      : initialAttendance;

  const presentCount = attendanceData.filter((r) => r.isPresent).length;
  const totalStudents = attendanceData.length;

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (existingAttendanceId) {
        return updateAttendance(existingAttendanceId, { attendance: data });
      }
      const localDate = parseLocalDate(selectedDate);
      const utcDate = new Date(
        Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
        ),
      );
      return createAttendance({
        course: courseId,
        date: utcDate.toISOString(),
        attendance: data,
      });
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setIsEditing(false);
      setLocalAttendance([]);
      toast.success(
        existingAttendanceId ? "Attendance updated!" : "Attendance saved!",
      );
      queryClient.invalidateQueries({
        queryKey: ["attendance", courseId, selectedDate],
      });
    },
    onError: (err) => {
      setIsSubmitting(false);
      toast.error(err.response?.data?.message ?? "Something went wrong");
    },
  });

  const handleEdit = () => {
    setLocalAttendance(
      existingAttendanceId ? serverAttendance : initialAttendance,
    );
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalAttendance([]);
  };

  const handleAttendanceChange = (studentId, isChecked) => {
    if (!canEdit || !isEditing) return;
    setLocalAttendance((prev) =>
      prev.map((r) =>
        r.student === studentId ? { ...r, isPresent: isChecked } : r,
      ),
    );
  };

  const handleSelectAll = (checked) => {
    if (!canEdit || !isEditing) return;
    setLocalAttendance((prev) =>
      prev.map((r) => ({ ...r, isPresent: checked })),
    );
  };

  const handleSave = () => {
    if (!localAttendance.length) {
      toast.warning("No students found");
      return;
    }
    setIsSubmitting(true);
    mutation.mutate(
      localAttendance.map((r) => ({
        student: r.student,
        isPresent: r.isPresent,
      })),
    );
  };

  const changeDate = (days) => {
    const next = stepDate(selectedDate, days);
    if (isFutureDateLocal(next)) return;
    setSelectedDate(next);
    setIsEditing(false);
    setLocalAttendance([]);
  };

  if (courseLoading || classLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <ImSpinner8 size={32} className="animate-spin text-green-600" />
          <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (classError) {
    return (
      <Container>
        <Alert variant="danger">
          Error loading class data. Please try again.
        </Alert>
      </Container>
    );
  }

  if (!classData?.data?.students?.length) {
    return (
      <Container>
        <Alert variant="warning">
          No students are enrolled in this class yet.
        </Alert>
      </Container>
    );
  }

  const allSelected = presentCount === totalStudents && totalStudents > 0;

  const statusInfo = (() => {
    if (isFutureDate)
      return {
        variant: "info",
        msg: "Cannot mark attendance for future dates.",
      };
    if (!isTodayDate && existingAttendanceId)
      return { variant: "info", msg: "Viewing past attendance — read-only." };
    if (!isTodayDate && !existingAttendanceId)
      return {
        variant: "warning",
        msg: "No attendance record found for this date.",
      };
    if (isTodayDate && !existingAttendanceId && !isEditing)
      return {
        variant: "info",
        msg: "Attendance not marked yet. Click 'Take Attendance' to begin.",
      };
    if (isTodayDate && existingAttendanceId && !isEditing)
      return { variant: "success", msg: "Today's attendance has been marked." };
    if (isTodayDate && existingAttendanceId && isEditing)
      return { variant: "warning", msg: "Editing today's attendance record." };
    return null;
  })();

  return (
    <Container>
      <div className="flex items-center gap-1 mb-6 text-sm text-zinc-500">
        <Link className="hover:text-zinc-900 transition-colors" to="/teacher">
          Teacher
        </Link>
        <LuChevronRight size={14} />
        <Link
          className="hover:text-zinc-900 transition-colors"
          to="/teacher/manage-attendance"
        >
          Attendance
        </Link>
        <LuChevronRight size={14} />
        <span className="text-zinc-900 font-medium">
          {courseData?.data?.name}
        </span>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Heading className="mb-1">{courseData?.data?.name}</Heading>
          {courseData?.data?.code && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <BsFileEarmarkCodeFill size={11} />
              {courseData?.data?.code}
            </span>
          )}
        </div>
        <Paragraph>
          {classData?.data?.name} &mdash; {totalStudents} student
          {totalStudents !== 1 ? "s" : ""}
        </Paragraph>
      </div>

      <div className="bg-whitep-6 mb-5">
        <div className="flex items-center gap-3 mt-5 flex-wrap">
          <StatPill label="Total" value={totalStudents} color="#3f3f46" />
          <StatPill label="Present" value={presentCount} color="#16a34a" />
          <StatPill
            label="Absent"
            value={totalStudents - presentCount}
            color="#dc2626"
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[14px] px-5 py-4 mb-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer"
          >
            <LuChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-[10px] px-3 py-2">
            <LuCalendar size={15} className="text-zinc-400" />
            <input
              type="date"
              value={selectedDate}
              max={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setIsEditing(false);
                setLocalAttendance([]);
              }}
              className="text-sm font-medium text-zinc-800 bg-transparent border-none outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => changeDate(1)}
            disabled={isTodayDate}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <LuChevronRightIcon size={18} />
          </button>
        </div>

        <p className="text-sm text-zinc-500 hidden md:block">
          {formatDisplayDate(selectedDate)}
        </p>

        <div className="flex items-center gap-2">
          {canEdit && !isEditing && (
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <LuPencil size={15} />
              {existingAttendanceId ? "Edit Attendance" : "Take Attendance"}
            </Button>
          )}

          {canEdit && isEditing && (
            <>
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <ImSpinner8 className="animate-spin" size={15} />
                ) : (
                  <LuSave size={15} />
                )}
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>

      {statusInfo && !isEditing && (
        <div className="mb-5">
          <Alert variant={statusInfo.variant}>{statusInfo.msg}</Alert>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-[14px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            {isEditing && canEdit && (
              <>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => handleSelectAll(!allSelected)}
                    className={`
                      w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-150 cursor-pointer
                      ${allSelected ? "bg-green-600 border-green-600" : "bg-white border-zinc-300"}
                    `}
                  >
                    {allSelected && (
                      <LuCheck
                        size={11}
                        className="text-white"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <span className="text-sm text-zinc-600 font-medium">
                    {allSelected ? "Deselect all" : "Select all"}
                  </span>
                </label>
                <span className="text-xs text-zinc-400">
                  {presentCount} selected
                </span>
              </>
            )}

            {!isEditing && (
              <span className="text-sm font-medium text-zinc-700">
                Students
              </span>
            )}
          </div>

          {isEditing && canEdit && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectAll(true)}
                className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer font-medium"
              >
                All Present
              </button>
              <button
                onClick={() => handleSelectAll(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer font-medium"
              >
                All Absent
              </button>
            </div>
          )}
        </div>

        {attendanceLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ImSpinner8 size={32} className="animate-spin text-green-600" />
            <p className="mt-3 text-zinc-500 text-sm">Loading attendance...</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-5 py-3 text-left w-14">
                  <span className="sr-only">Status</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <StudentRow
                  key={record.student}
                  record={record}
                  index={index}
                  isEditing={isEditing}
                  canEdit={canEdit}
                  onChange={handleAttendanceChange}
                />
              ))}
            </tbody>
          </table>
        )}

        {!attendanceLoading && attendanceData.length > 0 && (
          <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              {totalStudents} student{totalStudents !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              <span className="text-green-600">{presentCount} present</span>
              {" · "}
              <span className="text-red-500">
                {totalStudents - presentCount} absent
              </span>
            </span>
          </div>
        )}
      </div>
    </Container>
  );
};
