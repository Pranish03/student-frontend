import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LuChevronRight, LuBookOpen, LuUsers, LuInbox } from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";
import { useAuth } from "../../../hooks/useAuth";
import { axios } from "../../../lib/axios";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Button } from "../../../components/Button";
import { Paragraph } from "../../../components/ui/Paragraph";

const fetchStudentClass = async () => {
  const { data } = await axios.get(`/classes/my`);
  return data;
};

const CourseCard = ({ course, classInfo, index }) => {
  return (
    <div
      className="bg-white rounded-[10px] overflow-hidden border border-zinc-300 flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
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
          <InfoRow label="Teacher" value={course.teacher?.name} />
          <InfoRow
            label="Department"
            value={course.class?.department ?? classInfo?.department}
          />
          <InfoRow
            label="Academic Year"
            value={course.class?.academicYear ?? classInfo?.academicYear}
          />
        </div>

        <Link to={`/student/manage-courses/${course._id}`}>
          <Button className="w-full">View Course</Button>
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

export const ManageCourses = () => {
  const { user } = useAuth();
  const classId = user?.class?._id ?? user?.class;

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
        <span className="text-zinc-900 font-medium">Courses</span>
      </div>

      <div className="mb-8">
        <Heading className="mb-1">My Courses</Heading>
        <Paragraph>
          {isLoading
            ? "Loading..."
            : `${courses.length} course${courses.length !== 1 ? "s" : ""} enrolled`}
        </Paragraph>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <ImSpinner8 size={32} className="animate-spin text-green-600" />
          <p className="mt-3 text-zinc-500 text-sm">Loading your courses...</p>
        </div>
      ) : !classId ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <LuInbox size={56} className="text-zinc-300 mb-3" />
          <p className="text-zinc-500 font-semibold text-lg">
            Not enrolled in any class
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            Contact your administrator to be assigned to a class
          </p>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <LuBookOpen size={56} className="text-zinc-300 mb-3" />
          <p className="text-zinc-500 font-semibold text-lg">No courses yet</p>
          <p className="text-zinc-400 text-sm mt-1">
            Your class doesn&apos;t have any courses assigned
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course, i) => (
            <CourseCard
              key={course._id}
              course={course}
              classInfo={classData?.data}
              index={i}
            />
          ))}
        </div>
      )}
    </Container>
  );
};
