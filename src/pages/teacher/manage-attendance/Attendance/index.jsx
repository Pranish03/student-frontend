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
import { LuChevronRight } from "react-icons/lu";
import { Container } from "../../../../components/ui/Container";
import { Heading } from "../../../../components/ui/Heading";
import { Input } from "../../../../components/Input";
import { Button } from "../../../../components/Button";
import { Table } from "./Table";
import {
  isFutureDateLocal,
  isTodayLocal,
  parseLocalDate,
} from "../../../../utils/formatDate";
import { AlertStatus } from "./AlertStatus";
import { Alert } from "../../../../components/ui/Alert";
import { ImSpinner8 } from "react-icons/im";

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

  const {
    data: attendanceQueryData,
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useQuery({
    queryKey: ["attendance", courseId, selectedDate],
    queryFn: () => fetchAttendanceByCourseAndDate(courseId, selectedDate),
    enabled: !!courseId && !!selectedDate && !!classId,
    retry: false,
    throwOnError: false,
  });

  const isNotFound =
    attendanceError?.response?.status === 404 ||
    attendanceQueryData?.data?.length === 0;

  const existingRecord =
    !isNotFound && attendanceQueryData?.data?.[0]
      ? attendanceQueryData.data[0]
      : null;
  const existingAttendanceId = existingRecord?._id || null;

  const serverAttendance = existingRecord
    ? existingRecord.attendance.map((r) => ({
        student: r.student._id,
        isPresent: r.isPresent,
        studentName: r.student.name,
        studentEmail: r.student.email,
      }))
    : [];

  const initialAttendance =
    classData?.data?.students?.map((student) => ({
      student: student._id,
      isPresent: false,
      studentName: student.name,
      studentEmail: student.email,
    })) || [];

  const attendanceData = isEditing
    ? localAttendance
    : existingAttendanceId
      ? serverAttendance
      : initialAttendance;

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (existingAttendanceId) {
        return updateAttendance(existingAttendanceId, { attendance: data });
      } else {
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
      }
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setIsEditing(false);
      setLocalAttendance([]);
      toast.success(
        `Attendance ${existingAttendanceId ? "updated" : "saved"} successfully!`,
      );
      queryClient.invalidateQueries({
        queryKey: ["attendance", courseId, selectedDate],
      });
    },
    onError: (err) => {
      setIsSubmitting(false);
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const handleEdit = () => {
    const base = existingAttendanceId ? serverAttendance : initialAttendance;
    setLocalAttendance(base);
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

  const handleSelectAll = (isChecked) => {
    if (!canEdit || !isEditing) return;
    setLocalAttendance((prev) =>
      prev.map((r) => ({ ...r, isPresent: isChecked })),
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

  const presentCount = attendanceData.filter((r) => r.isPresent).length;
  const totalStudents = attendanceData.length;

  if (courseLoading || classLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <ImSpinner8 size={35} className="animate-spin text-green-600" />
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

  return (
    <Container>
      <div className="flex items-center gap-1 mb-4">
        <Link
          className="text-zinc-500 hover:underline hover:text-zinc-900"
          to="/teacher"
        >
          Teacher
        </Link>
        <LuChevronRight />
        <Link
          className="text-zinc-500 hover:underline hover:text-zinc-900"
          to="/teacher/manage-attendance"
        >
          Attendance
        </Link>
        <LuChevronRight />
        <span className="text-zinc-900">{courseData?.data?.name}</span>
      </div>

      <div className="mb-6">
        <Heading>Mark Attendance</Heading>
        <p className="text-base text-zinc-600 mt-1">
          {courseData?.data?.name} &mdash; {classData?.data?.name}
        </p>
      </div>

      {(existingAttendanceId || isEditing) && (
        <div className="flex items-center gap-6 mb-4 p-4 bg-zinc-50 border border-zinc-200 rounded-[10px]">
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-900">{totalStudents}</p>
            <p className="text-sm text-zinc-500">Total</p>
          </div>
          <div className="w-px h-10 bg-zinc-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{presentCount}</p>
            <p className="text-sm text-zinc-500">Present</p>
          </div>
          <div className="w-px h-10 bg-zinc-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">
              {totalStudents - presentCount}
            </p>
            <p className="text-sm text-zinc-500">Absent</p>
          </div>
          {totalStudents > 0 && (
            <>
              <div className="w-px h-10 bg-zinc-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-900">
                  {Math.round((presentCount / totalStudents) * 100)}%
                </p>
                <p className="text-sm text-zinc-500">Attendance</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mb-4">
        <AlertStatus
          existingAttendanceId={existingAttendanceId}
          selectedDate={selectedDate}
          isEditing={isEditing}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setIsEditing(false);
            setLocalAttendance([]);
          }}
          max={format(new Date(), "yyyy-MM-dd")}
          className="w-auto"
        />

        <div className="flex items-center gap-2">
          {canEdit && !isEditing && (
            <Button onClick={handleEdit}>
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
                {isSubmitting && (
                  <ImSpinner8 className="animate-spin text-lg" />
                )}
                {isSubmitting ? "Saving..." : "Save Attendance"}
              </Button>
            </>
          )}
        </div>
      </div>

      {attendanceLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <ImSpinner8 size={35} className="animate-spin text-green-600" />
          <p className="mt-2 text-zinc-600">Loading attendance...</p>
        </div>
      ) : (
        <Table
          canEdit={canEdit}
          isEditing={isEditing}
          attendanceData={attendanceData}
          handleAttendanceChange={handleAttendanceChange}
          handleSelectAll={handleSelectAll}
          presentCount={presentCount}
          totalStudents={totalStudents}
        />
      )}
    </Container>
  );
};
