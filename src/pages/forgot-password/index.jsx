import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../schemas/auth-schema";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

export const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    reset();
    navigate("/check-email");
    setServerError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-100">
        <h1 className="text-[28px] font-bold text-gray-900 text-center mb-1">
          Forgot password
        </h1>
        <p className="text-base text-center text-gray-800 mb-4">
          Enter your email to send password reset link
        </p>

        <form
          className="space-y-4 text-gray-800"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="email"
              className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.email ? "text-red-600" : "text-gray-900"}`}
            >
              Email
            </label>
            <Input
              className="w-full"
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register("email")}
              errors={errors.email}
            />
            {errors.email && (
              <p className="text-red-600 mt-2">{errors.email.message}</p>
            )}
          </div>

          {serverError && <p className="text-red-600 mt-2">{serverError}</p>}

          <Button type="submit" className="w-full mt-1">
            Send Email
          </Button>

          <div className="text-center font-medium">
            <Link className="hover:underline text-green-600" to="/">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
