import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/Button";
import { Container } from "../../../components/ui/Container";
import { Alert } from "../../../components/ui/Alert";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";
import { Link } from "react-router-dom";
import { LuChevronRight, LuUsers, LuCalendarCheck } from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";
import { axios } from "../../../lib/axios";

const fetchTeacherCourses = async (teacherId) => {
  const { data } = await axios.get(`/courses?teacher=${teacherId}`);
  return data;
};

export const ManageAttendance = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["courses", "teacher", user?._id],
    queryFn: () => fetchTeacherCourses(user._id),
    enabled: !!user?._id,
    staleTime: 2 * 60 * 1000,
  });

  const courses = data?.data ?? [];

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-60">
          <div className="flex flex-col items-center gap-3">
            <ImSpinner8 size={32} className="animate-spin text-green-600" />
            <p className="text-zinc-500 text-sm">Loading your courses...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          Failed to load courses. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex items-center gap-1 mb-6 text-sm text-zinc-500">
        <Link className="hover:text-zinc-900 transition-colors" to="/teacher">
          Teacher
        </Link>
        <LuChevronRight size={14} />
        <span className="text-zinc-900 font-medium">Attendance</span>
      </div>

      <div className="mb-8">
        <Heading className="mb-1">Manage Attendance</Heading>
        <Paragraph>
          {courses.length} course{courses.length !== 1 ? "s" : ""} — mark and
          track student attendance
        </Paragraph>
      </div>

      {courses.length === 0 ? (
        <Alert variant="warning">
          You are not assigned to any course at the moment.
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <AttendanceCourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </Container>
  );
};

const AttendanceCourseCard = ({ course }) => {
  const { data: summaryData } = useQuery({
    queryKey: ["attendance-summary", course._id],
    queryFn: () =>
      axios
        .get(`/attendances/${course._id}/summary`)
        .then((r) => r.data)
        .catch((e) => {
          if (e.response?.status === 404) return { data: null };
          throw e;
        }),
    staleTime: 2 * 60 * 1000,
  });

  const summary = summaryData?.data;
  const totalClasses = summary?.totalClasses ?? null;
  const studentCount = summary?.summary?.length ?? null;

  return (
    <div className="bg-white rounded-[10px] overflow-hidden border border-zinc-300 flex flex-col">
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-zinc-800 leading-tight pr-2">
            {course.name}
          </h3>
          {course.code && (
            <span className="flex items-center gap-1 text-sm font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-[10px] whitespace-nowrap shrink-0">
              <BsFileEarmarkCodeFill size={13} />
              {course.code}
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4 flex-1">
          <InfoRow label="Department" value={course.class?.department} />
          <InfoRow label="Class" value={course.class?.name} />
          <InfoRow label="Academic Year" value={course.class?.academicYear} />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-zinc-500">
            <LuCalendarCheck size={14} className="text-green-500" />
            {totalClasses === null ? (
              <span>No class held</span>
            ) : (
              <span>
                {totalClasses} class{totalClasses !== 1 ? "es" : ""} held
              </span>
            )}
          </div>
          <span className="text-zinc-300">·</span>
          <div className="flex items-center gap-1.5 text-sm text-zinc-500">
            <LuUsers size={14} className="text-blue-500" />
            {studentCount === null ? (
              <span>No students</span>
            ) : (
              <span>
                {studentCount} student{studentCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <Link to={`/teacher/manage-attendance/${course._id}`}>
          <Button className="w-full">Mark Attendance</Button>
        </Link>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <p className="text-sm text-zinc-500">
    <span className="font-medium text-zinc-700">{label}: </span>
    {value ?? <i className="text-zinc-400">Not assigned</i>}
  </p>
);
