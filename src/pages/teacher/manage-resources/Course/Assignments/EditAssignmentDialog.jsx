import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editResourceSchema } from "../../../../../schemas/noteSchema";
import { toast } from "sonner";
import { Dialog } from "../../../../../components/Dialog";
import { Input } from "../../../../../components/Input";
import { Button } from "../../../../../components/Button";
import { ImSpinner8 } from "react-icons/im";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editResource } from "../../../../../api/resources";
import { FileInput } from "../../../../../components/form/FileInput";
import { useEffect } from "react";
import { formatDateForInput } from "../../../../../utils/formatDate";

export const EditAssignmentDialog = ({ close, assignment, courseId }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      course: "",
      type: "",
      title: "",
      description: "",
      file: null,
    },
    resolver: zodResolver(editResourceSchema),
  });

  useEffect(() => {
    if (assignment) {
      reset({
        course: courseId,
        type: "assignment",
        title: assignment?.title || "",
        deadline: formatDateForInput(assignment?.deadline) || null,
        description: assignment?.description || "",
        file: assignment?.file || null,
      });
    }
  }, [assignment, courseId, reset]);

  const mutation = useMutation({
    mutationFn: editResource,
    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({ queryKey: ["assignment", courseId] });

      close();
      reset();
    },
  });

  const onSubmit = (data) => {
    if (data?.file && !Array.isArray(data.file)) {
      data.file = [data.file];
    }
    mutation.mutate({ id: assignment?._id, data });
  };

  return (
    <Dialog
      heading="Edit Assignment"
      desc="Enter new information below to update the assignment."
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
            htmlFor="title"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.title ? "text-red-600" : "text-zinc-900"}`}
          >
            Title
            <span className="text-red-600">*</span>
          </label>

          <Input
            className="w-full"
            type="text"
            id="title"
            placeholder="Assignment 1"
            disabled={mutation?.isPending}
            {...register("title")}
            errors={errors?.title}
          />

          {errors?.title && (
            <p className="text-red-600 mt-2">{errors?.title?.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="deadline"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.deadline ? "text-red-600" : "text-zinc-900"}`}
          >
            Deadline
            <span className="text-red-600">*</span>
          </label>

          <Input
            className="w-full"
            type="date"
            id="deadline"
            placeholder="OS Unit 1"
            disabled={mutation?.isPending}
            {...register("deadline")}
            errors={errors?.deadline}
          />

          {errors?.deadline && (
            <p className="text-red-600 mt-2">{errors?.deadline?.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="file"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.file ? "text-red-600" : "text-zinc-900"}`}
          >
            File
            <span className="text-red-600">*</span>
          </label>

          <FileInput
            onChange={(files) => {
              setValue("file", files || [], { shouldValidate: true });
            }}
            error={errors?.file}
            disabled={mutation?.isPending}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="description"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.description ? "text-red-600" : "text-zinc-900"}`}
          >
            Description
          </label>

          <textarea
            className={`w-full border rounded-[10px] text-base py-1.5 px-2.5 focus:outline-3 placeholder:text-zinc-500 text-zinc-900
            ${
              errors.description
                ? "border-red-600 focus:border-red-600 focus:outline-red-200"
                : "border-zinc-300 focus:border-green-600 focus:outline-green-300"
            }`}
            id="description"
            rows={4}
            placeholder="Write your assignment description..."
            disabled={mutation?.isPending}
            {...register("description")}
            errors={errors?.description}
          ></textarea>
        </div>

        <div className="flex items-center gap-4 justify-end">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              reset();
              close();
            }}
          >
            Cancel
          </Button>
          <Button
            className="flex items-center justify-center gap-3"
            type="submit"
            disabled={mutation?.isPending}
          >
            {mutation?.isPending ? (
              <>
                <ImSpinner8 className="animate-spin text-lg" />
                <span>Updating...</span>
              </>
            ) : (
              "Update Assignment"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
