import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdminSchema } from "../../../schemas/userSchema";
import { toast } from "sonner";
import { Dialog } from "../../../components/Dialog";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { ImSpinner8 } from "react-icons/im";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../../api/manageUsers";

export const AddAdminDialog = ({ close }) => {
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
    resolver: zodResolver(createAdminSchema),
  });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({ queryKey: ["admins"] });

      close();
      reset();
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <Dialog
      heading="Add Admin"
      desc="Enter admin information below to create a new admin."
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
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.name ? "text-red-600" : "text-gray-900"}`}
          >
            Name
            <span className="text-red-600">*</span>
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
            <p className="text-red-600 mt-2">{errors?.name?.message}</p>
          )}
        </div>

        <div className={`${mutation?.isError ? "mb-5" : "mb-7"}`}>
          <label
            htmlFor="email"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.email ? "text-red-600" : "text-gray-900"}`}
          >
            Email
            <span className="text-red-600">*</span>
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
            <p className="text-red-600 mt-2">{errors?.email?.message}</p>
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
              "Add Admin"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
