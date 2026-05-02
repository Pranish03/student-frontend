import { useState } from "react";
import { useForm } from "react-hook-form";
import Avatar from "react-avatar";
import { fetchAllStudents } from "../../../../api/manageUsers";
import { Dialog } from "../../../../components/Dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { enrollStudentsSchema } from "../../../../schemas/classSchema";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enrollStudents } from "../../../../api/manageClasses";
import { toast } from "sonner";
import { ImSpinner8 } from "react-icons/im";
import { IoSearch, IoClose } from "react-icons/io5";

export const EnrollStudentDialog = ({ classData, close }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const queryClient = useQueryClient();

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: fetchAllStudents,
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(enrollStudentsSchema),
    defaultValues: {
      students: [],
    },
  });

  const allStudents = studentsData?.data || [];
  const enrolledStudentIds = (classData?.students || []).map((s) => s._id);

  const availableStudents = allStudents.filter((student) => {
    if (enrolledStudentIds.includes(student._id)) return false;

    const studentClassId =
      typeof student.class === "object" ? student.class?._id : student.class;
    if (studentClassId) return false;

    if (searchTerm) {
      return (
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return true;
  });

  const studentsInOtherClasses = allStudents.filter((student) => {
    if (enrolledStudentIds.includes(student._id)) return false;
    const studentClassId =
      typeof student.class === "object" ? student.class?._id : student.class;
    return !!studentClassId;
  });

  const mutation = useMutation({
    mutationFn: enrollStudents,
    onSuccess: (data) => {
      toast.success(data?.message || "Student(s) enrolled successfully");
      queryClient.invalidateQueries();
      close();
    },
  });

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) => {
      const newSelection = prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId];

      setValue("students", newSelection);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === availableStudents.length) {
      setSelectedStudents([]);
      setValue("students", []);
    } else {
      const allIds = availableStudents.map((s) => s._id);
      setSelectedStudents(allIds);
      setValue("students", allIds);
    }
  };

  const onSubmit = (data) => mutation.mutate({ data, id: classData?._id });

  const noStudentsAtAll = allStudents.length === 0;
  const allEnrolledElsewhere =
    !noStudentsAtAll &&
    availableStudents.length === 0 &&
    studentsInOtherClasses.length > 0 &&
    !searchTerm;

  return (
    <Dialog
      heading="Enroll Students"
      desc="Select students to enroll in this class"
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
            placeholder="Search students by name or email..."
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

        {availableStudents.length > 0 && (
          <div className="flex items-center justify-between px-2 py-2 bg-zinc-50 rounded-[10px]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  selectedStudents.length === availableStudents.length &&
                  availableStudents.length > 0
                }
                onChange={handleSelectAll}
                className="w-4 h-4 text-green-600 rounded border-zinc-300 focus:ring-green-500 accent-green-600"
                disabled={isLoading || mutation?.isPending}
              />
              <span className="text-sm font-medium text-zinc-700">
                Select All Available Students
              </span>
            </label>
            <span className="text-sm text-zinc-500">
              {selectedStudents.length} selected
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
          ) : noStudentsAtAll ? (
            <div className="text-center py-12">
              <p className="text-zinc-500">No students available</p>
              <p className="text-sm text-zinc-400 mt-1">
                Add students first to enroll them in classes
              </p>
            </div>
          ) : allEnrolledElsewhere ? (
            <div className="text-center py-12">
              <p className="text-zinc-500">No available students</p>
              <p className="text-sm text-zinc-400 mt-1">
                All remaining students are already enrolled in another class
              </p>
            </div>
          ) : availableStudents.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <p className="text-zinc-500">No students found</p>
              <p className="text-sm text-zinc-400 mt-1">
                Try adjusting your search
              </p>
            </div>
          ) : availableStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500">
                All students are already enrolled in this class
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableStudents.map((student) => (
                <label
                  key={student._id}
                  className={`flex items-center border rounded-[10px] p-2.5 hover:bg-zinc-50 cursor-pointer transition-colors ${
                    selectedStudents.includes(student._id)
                      ? "bg-green-50 border-green-200"
                      : "border-black/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => handleCheckboxChange(student._id)}
                    className="w-4 h-4 text-green-600 rounded border-zinc-300 focus:ring-green-500 accent-green-600"
                    disabled={mutation?.isPending}
                  />

                  <div className="ml-3 flex items-center flex-1">
                    <Avatar
                      name={student.name}
                      value={student._id}
                      size={35}
                      round
                    />

                    <div className="ml-3 flex-1">
                      <p className="font-medium text-zinc-900">
                        {student.name || "Unnamed Student"}
                      </p>
                      <p className="text-sm text-zinc-600">{student.email}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {studentsInOtherClasses.length > 0 && !searchTerm && (
          <p className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-200 rounded-[10px] px-3 py-2">
            {studentsInOtherClasses.length} student
            {studentsInOtherClasses.length !== 1 ? "s are" : " is"} not shown
            because{" "}
            {studentsInOtherClasses.length !== 1 ? "they are" : "they are"}{" "}
            already enrolled in another class.
          </p>
        )}

        {errors.students && (
          <p className="text-red-600 text-sm mt-1">{errors.students.message}</p>
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
            disabled={mutation?.isPending || selectedStudents.length === 0}
          >
            {mutation?.isPending ? (
              <>
                <ImSpinner8 className="animate-spin text-lg" />
                <span>Enrolling...</span>
              </>
            ) : (
              `Enroll Student${selectedStudents.length !== 1 ? "s" : ""} (${selectedStudents.length})`
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
