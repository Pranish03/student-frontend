import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { resetPasswordSchema } from "../../schemas/auth-schema";

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirm: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    reset();
    setServerError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-100">
        <h1 className="text-[28px] font-bold text-gray-900 text-center mb-1">
          Reset password
        </h1>
        <p className="text-base text-center text-gray-800 mb-4">
          Create and confirm your new password
        </p>

        <form
          className="space-y-4 text-gray-800"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="password"
              className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.password ? "text-red-600" : "text-gray-900"}`}
            >
              Password
              <span className="text-red-600">*</span>
            </label>

            <div className="relative flex items-center">
              <Input
                className="w-full"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter new password"
                {...register("password")}
                errors={errors.password}
              />

              <button
                type="button"
                className="absolute right-3 cursor-pointer text-gray-400 hover:text-green-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm"
              className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.confirm ? "text-red-600" : "text-gray-900"}`}
            >
              Confirm password
              <span className="text-red-600">*</span>
            </label>

            <div className="relative flex items-center">
              <Input
                className="w-full"
                type={showConfirm ? "text" : "password"}
                id="confirm"
                placeholder="Confirm your password"
                {...register("confirm")}
                errors={errors.confirm}
              />

              <button
                type="button"
                className="absolute right-3 cursor-pointer text-gray-400 hover:text-green-600"
                onClick={() => setShowConfirm((prev) => !prev)}
              >
                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.confirm && (
              <p className="text-red-600 mt-2">{errors.confirm.message}</p>
            )}
          </div>

          {serverError && <p className="text-red-600 mt-2">{serverError}</p>}

          <Button type="submit" className="w-full mt-1">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};
