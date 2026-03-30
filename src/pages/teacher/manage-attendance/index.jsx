import { useQuery } from "@tanstack/react-query";
import { fetchAllCourses } from "../../../api/manageCourses";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/Button";
import { Container } from "../../../components/ui/Container";
import { Alert } from "../../../components/ui/Alert";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";
import { Link } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";

export const ManageAttendance = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchAllCourses,
  });

  const courseData = data?.data;
  const { user } = useAuth();

  const filteredCourse =
    user?.course && courseData
      ? courseData.filter((course) => user.course.includes(course._id))
      : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading courses...</div>
      </div>
    );
  }

  console.log(filteredCourse);

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

        <span className="text-zinc-900">Attendence</span>
      </div>

      <div className="mb-8">
        <Heading className="mb-1">Manage Attendance</Heading>
        <Paragraph>Total {filteredCourse.length || 0} Classes</Paragraph>
      </div>

      {filteredCourse.length === 0 ? (
        <Alert variant="warning">
          You are not assigned to any course at the moment.
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourse.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-[10px] overflow-hidden border border-zinc-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-zinc-800">
                    {course.name || course.title}
                  </h3>
                  {course.code && (
                    <span className="px-2 py-1 bg-green-200 text-green-600 text-sm font-medium rounded-[10px]">
                      {course.code}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-md text-zinc-500">
                    <span className="font-medium text-zinc-700">
                      Department:{" "}
                    </span>
                    {course.class.department ? (
                      course.class.department
                    ) : (
                      <i>Not assigned</i>
                    )}
                  </p>

                  <p className="text-md text-zinc-500">
                    <span className="font-medium text-zinc-700">Class: </span>
                    {course.class.name ? (
                      course.class.name
                    ) : (
                      <i>Not assigned</i>
                    )}
                  </p>

                  <p className="text-md text-zinc-500">
                    <span className="font-medium text-zinc-700">
                      Academic Year:{" "}
                    </span>
                    {course.class.academicYear ? (
                      course.class.academicYear
                    ) : (
                      <i>Not assigned</i>
                    )}
                  </p>
                </div>

                <Link to={`/teacher/manage-attendance/${course._id}`}>
                  <Button className="w-full">Mark Attendance</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};
