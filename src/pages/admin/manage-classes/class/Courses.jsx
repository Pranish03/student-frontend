import { LuBookOpen } from "react-icons/lu";
import { Button } from "../../../../components/Button";

export const Courses = ({ classData }) => {
  return (
    <div className="border border-zinc-300 rounded-[10px] p-6">
      <h2 className="text-lg font-semibold text-zinc-900 mb-2">Courses</h2>

      <div className="h-full">
        {classData.courses && classData.courses.length > 0 ? (
          <div className="space-y-2">
            {classData.courses.map((course) => (
              <div
                key={course._id}
                className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-zinc-900">{course.name}</h3>
                  <p className="text-sm text-zinc-500">Code: {course.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-600">Teacher</p>
                  <p className="text-sm font-medium text-zinc-900">
                    {course.teacher}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[80%]">
            <div className="text-center">
              <LuBookOpen size={40} className="text-zinc-300 mx-auto mb-1" />
              <p className="text-zinc-500">No courses assigned yet</p>
              <Button className="mt-3">Assign Courses</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
