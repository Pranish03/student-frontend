import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { axios } from "../../../lib/axios";
import { useFetch } from "../../../hooks/useFetch";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { updateStudentSchema } from "../../../schemas/userSchema";

export const EditStudentDialog = ({ id, close, onSuccess }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data } = useFetch(`/users/${id}`);

  const defaultValues = {
    name: data?.data?.name,
    email: data?.data?.email,
  };

  useEffect(() => {
    setError(null);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(updateStudentSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(`/users/${id}`, data);

      toast.success(res?.data?.message);
      onSuccess();
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      heading="Edit Student"
      desc="Enter new information below to update the student."
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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
            {...register("name")}
            errors={errors.name}
          />

          {errors.name && (
            <p className="text-red-600 mt-2">{errors.name.message}</p>
          )}
        </div>

        <div className={`${error ? "mb-5" : "mb-7"}`}>
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
            {...register("email")}
            errors={errors.email}
          />

          {errors.email && (
            <p className="text-red-600 mt-2">{errors.email.message}</p>
          )}
        </div>

        {error && <p className="text-red-600 mt-0 mb-0">{error}</p>}

        <div className="flex items-center gap-4 justify-end">
          <Button
            variant="secondary"
            type="button"
            onClick={() => reset(defaultValues)}
          >
            Cancel
          </Button>
          <Button
            className="flex items-center justify-center gap-3"
            type="submit"
            disabled={loading}
          >
            {loading && <ImSpinner8 className="animate-spin text-lg" />}
            Add Student
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
