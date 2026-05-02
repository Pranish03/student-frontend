/* eslint-disable react-hooks/incompatible-library */
import { useState } from "react";
import { useForm } from "react-hook-form";
import Avatar from "react-avatar";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { ImSpinner8 } from "react-icons/im";
import { IoSearch, IoClose } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllTeachers } from "../../../api/manageUsers";
import { assignTeacher } from "../../../api/manageCourses";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignTeacherSchema } from "../../../schemas/courseSchema";

export const AssignTeacherDialog = ({ course, close }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teacher: course?.teacher?._id || "",
    },
    resolver: zodResolver(assignTeacherSchema),
  });

  const selectedTeacher = watch("teacher");

  const { data, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchAllTeachers,
  });

  const teachers = data?.data || [];

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const mutation = useMutation({
    mutationFn: assignTeacher,
    onSuccess: (data) => {
      toast.success(data?.message || "Teacher assigned successfully");

      queryClient.invalidateQueries({ queryKey: ["courses"] });
      close();
    },
  });

  const onSubmit = (data) => mutation.mutate({ id: course?._id, data });

  return (
    <Dialog
      heading={course?.teacher ? "Change Teacher" : "Assign Teacher"}
      desc={`${course?.name} (${course?.code})`}
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
            placeholder="Search teachers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10"
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

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <ImSpinner8 className="animate-spin text-3xl text-zinc-400" />
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-500">No teachers found</p>
              {searchTerm && (
                <p className="text-sm text-zinc-400 mt-1">
                  Try adjusting your search
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 space-y-3">
              {filteredTeachers.map((teacher) => (
                <label
                  key={teacher._id}
                  className={`flex items-center border rounded-[10px] p-2.5 hover:bg-zinc-50 cursor-pointer transition-colors ${
                    selectedTeacher === teacher._id
                      ? "bg-green-50 border-green-200"
                      : "border-black/20"
                  }`}
                >
                  <input
                    type="radio"
                    value={teacher._id}
                    {...register("teacher")}
                    className="w-4 h-4 text-green-600 border-zinc-300 focus:ring-green-500 accent-green-600"
                  />

                  <div className="ml-3 flex items-center flex-1">
                    <Avatar
                      name={teacher.name}
                      value={teacher._id}
                      size={35}
                      round
                    />

                    <div className="ml-3 flex-1">
                      <p className="font-medium text-zinc-900">
                        {teacher.name || "Unnamed Teacher"}
                      </p>
                      <p className="text-sm text-zinc-600">{teacher.email}</p>
                    </div>

                    {course?.teacher?._id === teacher._id && (
                      <span className="text-xs border border-green-900/20 text-green-500 bg-green-100 px-2 py-1 rounded-full">
                        Currently Assigned
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {errors.teacher && (
          <p className="text-red-600 text-sm mt-1">{errors.teacher.message}</p>
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
            className="flex items-center justify-center gap-3 min-w-35"
            type="submit"
            disabled={mutation?.isPending}
          >
            {mutation?.isPending ? (
              <>
                <ImSpinner8 className="animate-spin text-lg" />
                <span>Assigning...</span>
              </>
            ) : course?.teacher ? (
              "Change Teacher"
            ) : (
              "Assign Teacher"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
