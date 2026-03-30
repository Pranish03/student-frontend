/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const Attendance = () => {
  const { id: courseId } = useParams();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [attendanceData, setAttendanceData] = useState([]);
  const [existingAttendanceId, setExistingAttendanceId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isFutureDate = isFutureDateLocal(selectedDate);
  const isTodayDate = isTodayLocal(selectedDate);

  const canEdit = isTodayDate && !isFutureDate;

  useEffect(() => {
    setAttendanceData([]);
    setExistingAttendanceId(null);
    setIsEditing(false);
  }, [selectedDate]);

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

  const { data: attendanceQueryData, refetch: refetchAttendance } = useQuery({
    queryKey: ["attendance", courseId, selectedDate],
    queryFn: () => fetchAttendanceByCourseAndDate(courseId, selectedDate),
    enabled: !!courseId && !!selectedDate,
    retry: false,
  });

  useEffect(() => {
    if (!attendanceQueryData) return;

    if (attendanceQueryData?.data && attendanceQueryData.data.length > 0) {
      const attendanceRecord = attendanceQueryData.data[0];
      setExistingAttendanceId(attendanceRecord._id);

      const mappedAttendance = attendanceRecord.attendance.map((record) => ({
        student: record.student._id,
        isPresent: record.isPresent,
        studentName: record.student.name,
        studentEmail: record.student.email,
      }));

      setAttendanceData(mappedAttendance);

      if (isTodayDate) {
        setIsEditing(false);
      }
    } else {
      setExistingAttendanceId(null);

      if (isTodayDate) {
        setIsEditing(true);
      }
    }
  }, [attendanceQueryData, isTodayDate]);

  useEffect(() => {
    if (courseId && selectedDate) {
      refetchAttendance();
    }
  }, [selectedDate, courseId, refetchAttendance]);

  useEffect(() => {
    if (classData?.data?.students && !existingAttendanceId && isEditing) {
      const initialAttendance = classData.data.students.map((student) => ({
        student: student._id,
        isPresent: false,
        studentName: student.name,
        studentEmail: student.email,
      }));

      setAttendanceData(initialAttendance);
    }
  }, [classData, existingAttendanceId, isEditing]);

  const attendanceMutation = useMutation({
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
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
      refetchAttendance();
      queryClient.invalidateQueries({ queryKey: ["attendance", courseId] });
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error("Error saving attendance:", error);
      alert(
        error.response?.data?.message ||
          "Failed to save attendance. Please try again.",
      );
    },
  });

  const handleAttendanceChange = (studentId, isChecked) => {
    if (!canEdit || !isEditing) return;
    setAttendanceData((prevData) =>
      prevData.map((record) =>
        record.student === studentId
          ? { ...record, isPresent: isChecked }
          : record,
      ),
    );
  };

  const handleSelectAll = (isChecked) => {
    if (!canEdit || !isEditing) return;
    setAttendanceData((prevData) =>
      prevData.map((record) => ({ ...record, isPresent: isChecked })),
    );
  };

  const handleSaveAttendance = () => {
    if (!attendanceData.length) {
      alert("No students to mark attendance for");
      return;
    }

    setIsSubmitting(true);

    const formattedAttendance = attendanceData.map((record) => ({
      student: record.student,
      isPresent: record.isPresent,
    }));

    attendanceMutation.mutate(formattedAttendance);
  };

  const handleEdit = () => {
    if (attendanceData.length > 0) {
      setIsEditing(true);
    } else if (classData?.data?.students) {
      const editableAttendance = classData.data.students.map((student) => ({
        student: student._id,
        isPresent: false,
        studentName: student.name,
        studentEmail: student.email,
      }));
      setAttendanceData(editableAttendance);
      setIsEditing(true);
    }
  };

  const presentCount = attendanceData.filter(
    (record) => record.isPresent,
  ).length;

  const totalStudents = attendanceData.length;

  const attendancePercentage =
    totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0;

  if (courseLoading || classLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-zinc-500">Loading course and student data...</div>
      </div>
    );
  }

  if (classError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">Error loading class data</p>
          <p className="text-red-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!classData?.data?.students || classData.data.students.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-yellow-700">No students found in this class</p>
        </div>
      </div>
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

      <div className="mb-8">
        <Heading className="mb-1">Mark Attendance</Heading>
        <Paragraph>
          {classData?.data?.name}, {courseData?.data?.name}
        </Paragraph>
      </div>

      <AlertStatus
        existingAttendanceId={existingAttendanceId}
        isEditing={isEditing}
        selectedDate={selectedDate}
      />

      <div className="p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <label className="font-medium text-zinc-700 ">Select Date:</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className=" text-zinc-600">
              <span className="font-medium">Present: </span> {presentCount}/
              {totalStudents}
              <span className="ml-2 text-green-500">
                ({attendancePercentage}%)
              </span>
            </div>

            {canEdit && !isEditing && existingAttendanceId && (
              <Button onClick={handleEdit}>Edit Attendance</Button>
            )}

            {canEdit && isEditing && (
              <Button onClick={handleSaveAttendance} disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : existingAttendanceId
                    ? "Update Attendance"
                    : "Save Attendance"}
              </Button>
            )}
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md">
            Attendance {existingAttendanceId ? "updated" : "saved"}{" "}
            successfully!
          </div>
        )}
      </div>

      <Table
        canEdit={canEdit}
        attendanceData={attendanceData}
        handleAttendanceChange={handleAttendanceChange}
        handleSelectAll={handleSelectAll}
        isEditing={isEditing}
        presentCount={presentCount}
        totalStudents={totalStudents}
      />
    </Container>
  );
};
