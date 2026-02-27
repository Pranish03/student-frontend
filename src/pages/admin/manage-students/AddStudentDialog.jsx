import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStudentSchema } from "../../../schemas/userSchema";
import { axios } from "../../../lib/axios";
import { toast } from "sonner";
import { Dialog } from "../../../components/Dialog";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { ImSpinner8 } from "react-icons/im";

export const AddStudentDialog = ({ close, onSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(null);
  }, []);

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
    resolver: zodResolver(createStudentSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/users", data);

      toast.success(res?.data?.message);
      onSuccess();
      close();
      reset();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      heading="Add Student"
      desc="Enter student information below to create a new student."
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

        <Button
          className="flex items-center justify-center gap-3 float-end"
          type="submit"
          disabled={loading}
        >
          {loading && <ImSpinner8 className="animate-spin text-lg" />}
          Add Student
        </Button>
      </form>
    </Dialog>
  );
};
