import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LuChevronRight, LuBookOpen, LuUsers, LuInbox } from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { ImSpinner8 } from "react-icons/im";
import { useAuth } from "../../../hooks/useAuth";
import { axios } from "../../../lib/axios";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";

const fetchStudentClass = async () => {
  const { data } = await axios.get(`/classes/my`);
  return data;
};

const CourseCard = ({ course, index }) => {
  return (
    <Link
      to={`/student/manage-courses/${course._id}`}
      className="group block bg-white border border-zinc-200 rounded-[14px] p-6 hover:border-green-300 hover:shadow-md transition-all duration-200"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-[10px] bg-green-50 border border-green-100 flex items-center justify-center group-hover:bg-green-100 transition-colors">
          <LuBookOpen size={20} className="text-green-600" />
        </div>
        {course.code && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
            <BsFileEarmarkCodeFill size={11} />
            {course.code}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-zinc-900 text-base mb-1 group-hover:text-green-700 transition-colors leading-snug">
        {course.name}
      </h3>

      {course.teacher && (
        <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-2">
          <LuUsers size={13} className="shrink-0" />
          {course.teacher.name || course.teacher}
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
        <span className="text-xs text-zinc-400">View notes & assignments</span>
        <LuChevronRight
          size={15}
          className="text-zinc-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all"
        />
      </div>
    </Link>
  );
};

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
      <div className="flex items-center gap-1 mb-4 text-sm">
        <Link
          className="text-zinc-500 hover:underline hover:text-zinc-900"
          to="/student"
        >
          Student
        </Link>
        <LuChevronRight size={14} className="text-zinc-400" />
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
            <CourseCard key={course._id} course={course} index={i} />
          ))}
        </div>
      )}
    </Container>
  );
};
