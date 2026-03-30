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
import { Paragraph } from "../../../../components/ui/Paragraph";
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

  // 📦 Queries
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

  const { data: attendanceQueryData } = useQuery({
    queryKey: ["attendance", courseId, selectedDate],
    queryFn: () => fetchAttendanceByCourseAndDate(courseId, selectedDate),
    enabled: !!courseId && !!selectedDate,
    retry: false,
  });

  // 🧠 Derived Data (NO STATE)
  const existingRecord = attendanceQueryData?.data?.[0] || null;
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

  // 🔥 FINAL SOURCE OF TRUTH
  const attendanceData = isEditing
    ? localAttendance
    : existingAttendanceId
      ? serverAttendance
      : initialAttendance;

  // 🚀 Mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      if (existingAttendanceId) {
        return updateAttendance(existingAttendanceId, { attendance: data });
      } else {
        return createAttendance({
          course: courseId,
          date: parseLocalDate(selectedDate),
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
      toast(err.response?.data?.message || "Something went wrong");
    },
  });

  // 🧠 Handlers
  const handleEdit = () => {
    setLocalAttendance(attendanceData);
    setIsEditing(true);
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
    if (!attendanceData.length) {
      toast.warning("No students found");
      return;
    }

    setIsSubmitting(true);

    mutation.mutate(
      attendanceData.map((r) => ({
        student: r.student,
        isPresent: r.isPresent,
      })),
    );
  };

  // 📊 Stats
  const presentCount = attendanceData.filter((r) => r.isPresent).length;
  const totalStudents = attendanceData.length;

  // 🧱 UI states
  if (courseLoading || classLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (classError) {
    return <Alert variant="Danger">Error loading class</Alert>;
  }

  if (!classData?.data?.students?.length) {
    return <Alert variant="warning">No students found</Alert>;
  }

  return (
    <Container>
      <div className="flex items-center gap-1 mb-4">
        <Link to="/teacher">Teacher</Link>
        <LuChevronRight />
        <Link to="/teacher/manage-attendance">Attendance</Link>
        <LuChevronRight />
        <span>{courseData?.data?.name}</span>
      </div>

      <Heading>Mark Attendance</Heading>

      <AlertStatus
        existingAttendanceId={existingAttendanceId}
        isEditing={isEditing}
        selectedDate={selectedDate}
      />

      {/* Controls */}
      <div className="flex justify-between mt-4">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setIsEditing(false);
            setLocalAttendance([]);
          }}
          max={format(new Date(), "yyyy-MM-dd")}
        />

        <div>
          {canEdit && !isEditing && (
            <Button onClick={handleEdit}>
              {existingAttendanceId ? "Edit" : "Take Attendance"}
            </Button>
          )}

          {canEdit && isEditing && (
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table
        canEdit={canEdit}
        isEditing={isEditing}
        attendanceData={attendanceData}
        handleAttendanceChange={handleAttendanceChange}
        handleSelectAll={handleSelectAll}
        presentCount={presentCount}
        totalStudents={totalStudents}
      />
    </Container>
  );
};
