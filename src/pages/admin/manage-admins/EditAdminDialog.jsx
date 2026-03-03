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
import { useUser } from "../../../hooks/useUser";

export const EditAdminDialog = ({ id, close }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useUser(id);

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
    if (data?.data) {
      reset({
        name: data?.data?.name,
        email: data?.data?.email,
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: editUser,
    onSuccess: (data) => {
      toast.success(data?.message || "Admin updated successfully");

      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });

      close();
    },
  });

  const onSubmit = (data) => mutation.mutate({ data, id });

  if (isLoading) {
    return (
      <Dialog
        heading="Edit Admin"
        desc="Loading admin information..."
        close={close}
      >
        <div className="flex justify-center items-center py-8">
          <ImSpinner8 className="animate-spin text-3xl text-gray-500" />
        </div>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog
        heading="Edit Admin"
        desc="Failed to load admin information"
        close={close}
      >
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Could not load admin data</p>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      heading="Edit Admin"
      desc="Enter new information below to update the admin."
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
              errors?.name ? "text-red-600" : "text-gray-900"
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
              errors?.email ? "text-red-600" : "text-gray-900"
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
              "Update Admin"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
