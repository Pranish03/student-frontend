import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/Button";
import { Container } from "../../../components/ui/Container";
import { Alert } from "../../../components/ui/Alert";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";
import { Link } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { axios } from "../../../lib/axios";
import { ImSpinner8 } from "react-icons/im";

const fetchTeacherCourses = async (teacherId) => {
  const { data } = await axios.get(`/courses?teacher=${teacherId}`);
  return data;
};

export const ManageAssignment = () => {
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
      <div className="flex items-center gap-1 mb-4">
        <Link
          className="text-zinc-500 hover:underline hover:text-zinc-900"
          to="/teacher"
        >
          Teacher
        </Link>
        <LuChevronRight />
        <span className="text-zinc-900">Assignment</span>
      </div>

      <div className="mb-8">
        <Heading className="mb-1">Manage Assignment</Heading>
        <Paragraph>
          Total {courses.length} course{courses.length !== 1 ? "s" : ""}
        </Paragraph>
      </div>

      {courses.length === 0 ? (
        <Alert variant="warning">
          You are not assigned to any course at the moment.
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </Container>
  );
};

const CourseCard = ({ course }) => {
  const { data: resourceData } = useQuery({
    queryKey: ["assignment", course._id],
    queryFn: () =>
      axios
        .get(`/resources/course/${course._id}?type=assignment`)
        .then((r) => r.data)
        .catch((e) => {
          if (e.response?.status === 404) return { resources: [] };
          throw e;
        }),
    staleTime: 2 * 60 * 1000,
  });

  const assignmentCount = resourceData?.resources?.length ?? null;

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

        <div className="mb-4">
          {assignmentCount === null ? (
            <div className="h-6 w-28 bg-zinc-100 rounded-full animate-pulse" />
          ) : (
            <span className="text-sm text-zinc-500">
              {assignmentCount === 0
                ? "No assignments yet"
                : `${assignmentCount} assignment${assignmentCount !== 1 ? "s" : ""}`}
            </span>
          )}
        </div>

        <Link to={`/teacher/manage-assignment/${course._id}`}>
          <Button className="w-full">Upload or Browse Assignment</Button>
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
