import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { ImSpinner8 } from "react-icons/im";
import { updateClassSchema } from "../../../schemas/classSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editClass } from "../../../api/manageClasses";

export const EditClassDialog = ({ classData, close }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      department: "",
      academicYear: null,
      capacity: null,
    },
    resolver: zodResolver(updateClassSchema),
  });

  useEffect(() => {
    if (classData) {
      reset({
        name: classData?.name || "",
        department: classData?.department || "",
        academicYear: classData?.academicYear || "",
        capacity: classData?.capacity || "",
      });
    }
  }, [classData, reset]);

  const mutation = useMutation({
    mutationFn: editClass,
    onSuccess: (data) => {
      toast.success(data?.message || "Class updated successfully");

      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["class", classData?._id] });

      close();
    },
  });

  const onSubmit = (data) => mutation.mutate({ data, id: classData?._id });

  return (
    <Dialog
      heading="Edit Class"
      desc="Enter new information below to update the class."
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
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.name ? "text-red-600" : "text-zinc-900"}`}
          >
            Name
            <span className="text-red-600">*</span>
          </label>

          <Input
            className="w-full"
            type="text"
            id="name"
            placeholder="CS Semester 1"
            disabled={mutation?.isPending}
            {...register("name")}
            errors={errors?.name}
          />

          {errors?.name && (
            <p className="text-red-600 mt-2">{errors?.name?.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="department"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors?.department ? "text-red-600" : "text-zinc-900"}`}
          >
            Department
            <span className="text-red-600">*</span>
          </label>

          <Input
            className="w-full"
            type="text"
            id="department"
            placeholder="Computer Science"
            disabled={mutation?.isPending}
            {...register("department")}
            errors={errors?.department}
          />

          {errors?.department && (
            <p className="text-red-600 mt-2">{errors?.department?.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="academicYear"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors?.academicYear ? "text-red-600" : "text-zinc-900"}`}
          >
            Academic Year
            <span className="text-red-600">*</span>
          </label>

          <Input
            className="w-full"
            type="number"
            id="academicYear"
            placeholder="2026"
            min="2000"
            max="2100"
            step="1"
            disabled={mutation?.isPending}
            {...register("academicYear")}
            errors={errors?.academicYear}
          />

          {errors?.academicYear && (
            <p className="text-red-600 mt-2">{errors?.academicYear?.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="capacity"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors?.capicity ? "text-red-600" : "text-zinc-900"}`}
          >
            Capacity
            <span className="text-red-600">*</span>
          </label>

          <Input
            className="w-full"
            type="number"
            id="capacity"
            placeholder="35"
            min="10"
            max="35"
            step="1"
            disabled={mutation?.isPending}
            {...register("capacity")}
            errors={errors?.capacity}
          />

          {errors?.capacity && (
            <p className="text-red-600 mt-2">{errors?.capacity?.message}</p>
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
              "Update Class"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
