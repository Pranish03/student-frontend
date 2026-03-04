import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImSpinner8 } from "react-icons/im";
import { forgotPasswordSchema } from "../../../schemas/authSchema";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { forgotPassword } from "../../../api/auth";

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      navigate("/check-email");
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-95">
        <h1 className="text-2xl font-bold text-zinc-900 text-center mb-1">
          Forgot password?
        </h1>
        <h2 className="text-base text-center text-zinc-800 mb-4">
          Enter your email to send password reset link
        </h2>

        <form className="text-zinc-800" onSubmit={handleSubmit(onSubmit)}>
          <div className={`${mutation?.isError ? "mb-5" : "mb-7"}`}>
            <label
              htmlFor="email"
              className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.email ? "text-red-600" : "text-zinc-900"}`}
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
              errors={errors.email}
            />
            {errors.email && (
              <p className="text-red-600 mt-2">{errors.email.message}</p>
            )}
          </div>

          {mutation?.isError && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-base">
                {mutation?.error?.response?.data?.message ||
                  "Something went wrong"}
              </p>
            </div>
          )}

          <div className="w-full mt-5 mb-7">
            <Button
              className="w-full flex items-center justify-center gap-3"
              type="submit"
              disabled={mutation?.isPending}
            >
              {mutation?.isPending && (
                <ImSpinner8 className="animate-spin text-lg" />
              )}
              Send Email
            </Button>
          </div>

          <div className="text-center">
            <Link to="/" className="font-medium hover:underline text-green-600">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
