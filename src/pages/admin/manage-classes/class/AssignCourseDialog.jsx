import { useState } from "react";
import { useForm } from "react-hook-form";
import { fetchAllCourses } from "../../../../api/manageCourses";
import { Dialog } from "../../../../components/Dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignCoursesSchema } from "../../../../schemas/classSchema";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignCourses } from "../../../../api/manageClasses";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { IoSearch, IoClose } from "react-icons/io5";

export const AssignCourseDialog = ({ classData, close }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const queryClient = useQueryClient();

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchAllCourses,
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(assignCoursesSchema),
    defaultValues: {
      courses: [],
    },
  });

  const allCourses = coursesData?.data || [];
  const assignedCourses = classData?.courses || [];
  const assignedCourseIds = assignedCourses.map((course) => course._id);

  const availableCourses = allCourses.filter(
    (course) =>
      !assignedCourseIds.includes(course._id) &&
      (course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const mutation = useMutation({
    mutationFn: assignCourses,
    onSuccess: (data) => {
      toast.success(data?.message || "Course(s) assigned successfully");

      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({
        queryKey: ["class", classData?._id],
      });
      close();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to assign courses");
    },
  });

  const handleCheckboxChange = (courseId) => {
    setSelectedCourses((prev) => {
      const newSelection = prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];

      setValue("courses", newSelection);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === availableCourses.length) {
      setSelectedCourses([]);
      setValue("courses", []);
    } else {
      const allIds = availableCourses.map((course) => course._id);
      setSelectedCourses(allIds);
      setValue("courses", allIds);
    }
  };

  const onSubmit = (data) => mutation.mutate({ data, id: classData?._id });

  return (
    <Dialog
      heading="Assign Courses"
      desc="Select courses to assign to this class"
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mutation?.isError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-base">
              {mutation?.error?.response?.data?.message ||
                "Something went wrong"}
            </p>
          </div>
        )}

        <div className="relative">
          <IoSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search courses by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10"
            disabled={isLoading}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <IoClose size={18} />
            </button>
          )}
        </div>

        {availableCourses.length > 0 && (
          <div className="flex items-center justify-between px-2 py-2 bg-zinc-50 rounded-[10px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  selectedCourses.length === availableCourses.length &&
                  availableCourses.length > 0
                }
                onChange={handleSelectAll}
                className="w-4 h-4 text-green-600 rounded border-zinc-300 focus:ring-green-500 accent-green-600"
                disabled={isLoading || mutation?.isPending}
              />
              <span className="text-sm font-medium text-zinc-700">
                Select All Available Courses
              </span>
            </label>
            <span className="text-sm text-zinc-500">
              {selectedCourses.length} selected
            </span>
          </div>
        )}

        <div
          className="max-h-96 overflow-y-auto scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <ImSpinner8 className="animate-spin text-3xl text-zinc-400" />
            </div>
          ) : availableCourses.length === 0 ? (
            <div className="text-center py-12">
              {allCourses.length === 0 ? (
                <>
                  <p className="text-zinc-500">No courses available</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Add courses first to assign them to classes
                  </p>
                </>
              ) : (
                <>
                  {searchTerm ? (
                    <p className="text-zinc-500">No available courses found</p>
                  ) : (
                    <p className="text-zinc-500">
                      All courses are already assigned to this class
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {availableCourses.map((course) => (
                <label
                  key={course._id}
                  className={`flex items-center border rounded-[10px] p-2.5 hover:bg-zinc-50 cursor-pointer transition-colors ${
                    selectedCourses.includes(course._id)
                      ? "bg-green-50 border-green-200"
                      : "border-black/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course._id)}
                    onChange={() => handleCheckboxChange(course._id)}
                    className="w-4 h-4 text-green-600 rounded border-zinc-300 focus:ring-green-500 accent-green-600"
                    disabled={mutation?.isPending}
                  />

                  <div className="ml-3 flex gap-2">
                    <p className="flex items-center text-sm font-medium gap-1 text-white bg-green-600 w-fit py-0.5 px-2.5 rounded-full">
                      <BsFileEarmarkCodeFill size={16} />
                      {course.code || "No code"}
                    </p>
                    <p className="font-medium text-zinc-900">
                      {course.name || "Unnamed Course"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {errors.courses && (
          <p className="text-red-600 text-sm mt-1">{errors.courses.message}</p>
        )}

        <div className="flex items-center gap-4 justify-end pt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={close}
            disabled={mutation?.isPending}
          >
            Cancel
          </Button>
          <Button
            className="flex items-center justify-center gap-3 min-w-30"
            type="submit"
            disabled={mutation?.isPending || selectedCourses.length === 0}
          >
            {mutation?.isPending ? (
              <>
                <ImSpinner8 className="animate-spin text-lg" />
                <span>Assigning...</span>
              </>
            ) : (
              `Assign Course${selectedCourses.length !== 1 ? "s" : ""} (${selectedCourses.length})`
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
