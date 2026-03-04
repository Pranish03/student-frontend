import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { ImSpinner8 } from "react-icons/im";
import { updateStudentSchema } from "../../../schemas/userSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUser } from "../../../api/manageUsers";

export const EditStudentDialog = ({ student, close }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
    resolver: zodResolver(updateStudentSchema),
  });

  useEffect(() => {
    if (student) {
      reset({
        name: student?.name || "",
        email: student?.email,
      });
    }
  }, [student, reset]);

  const mutation = useMutation({
    mutationFn: editUser,
    onSuccess: (data) => {
      toast.success(data?.message || "Student updated successfully");

      queryClient.invalidateQueries({ queryKey: ["students"] });

      close();
    },
  });

  const onSubmit = (data) => mutation.mutate({ data, id: student?._id });

  return (
    <Dialog
      heading="Edit Student"
      desc="Enter new information below to update the student."
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
            placeholder="John Doe"
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
            htmlFor="email"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${
              errors?.email ? "text-red-600" : "text-zinc-900"
            }`}
          >
            Email
            <span className="text-red-600 ml-1">*</span>
          </label>

          <Input
            className="w-full"
            type="email"
            id="email"
            placeholder="m@example.com"
            disabled={mutation?.isPending}
            {...register("email")}
            errors={errors?.email}
          />

          {errors?.email && (
            <p className="text-red-600 mt-2 text-sm">
              {errors?.email?.message}
            </p>
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
              "Update Student"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
