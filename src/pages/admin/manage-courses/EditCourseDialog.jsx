import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { ImSpinner8 } from "react-icons/im";
import { updateCourseSchema } from "../../../schemas/courseSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCourse } from "../../../api/manageCourses";

export const EditCourseDialog = ({ course, close }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
    },
    resolver: zodResolver(updateCourseSchema),
  });

  useEffect(() => {
    if (course) {
      reset({
        name: course?.name || "",
        code: course?.code || "",
      });
    }
  }, [course, reset]);

  const mutation = useMutation({
    mutationFn: editCourse,
    onSuccess: (data) => {
      toast.success(data?.message || "Course updated successfully");

      queryClient.invalidateQueries({ queryKey: ["courses"] });
      close();
    },
  });

  const onSubmit = (data) => mutation.mutate({ data, id: course?._id });

  return (
    <Dialog
      heading="Edit Course"
      desc="Enter new information below to update the course."
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {mutation?.isError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-base">
              {mutation?.error?.response?.data?.message ||
                "Something went wrong"}
            </p>
          </div>
        )}

        <div className="mb-5">
          <label
            htmlFor="name"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${
              errors?.name ? "text-red-600" : "text-zinc-900"
            }`}
          >
            Name
            <span className="text-red-600 ml-1">*</span>
          </label>

          <Input
            className="w-full"
            type="text"
            id="name"
            placeholder="Operating System"
            disabled={mutation?.isPending}
            {...register("name")}
            errors={errors?.name}
          />

          {errors?.name && (
            <p className="text-red-600 mt-2 text-sm">{errors?.name?.message}</p>
          )}
        </div>

        <div className="mb-7">
          <label
            htmlFor="code"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${
              errors?.code ? "text-red-600" : "text-zinc-900"
            }`}
          >
            Code
            <span className="text-red-600 ml-1">*</span>
          </label>

          <Input
            className="w-full"
            type="text"
            id="code"
            placeholder="CSC301"
            disabled={mutation?.isPending}
            {...register("code")}
            errors={errors?.code}
          />

          {errors?.code && (
            <p className="text-red-600 mt-2 text-sm">{errors?.code?.message}</p>
          )}
        </div>

        <div className="flex items-center gap-4 justify-end">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              reset();
              close();
            }}
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
                <span>Updating...</span>
              </>
            ) : (
              "Update Course"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
