import { useForm } from "react-hook-form";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClass } from "../../../api/manageClasses";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../../components/Dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClassSchema } from "../../../schemas/classSchema";

export const AddClassDialog = ({ close }) => {
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
    resolver: zodResolver(createClassSchema),
  });

  const mutation = useMutation({
    mutationFn: createClass,
    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({ queryKey: ["classes"] });

      close();
      reset();
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <Dialog
      heading="Add Class"
      desc="Enter class information below to create a new class."
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
            placeholder="2024"
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
                <span>Adding...</span>
              </>
            ) : (
              "Add Class"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
