import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import { useAuth } from "../../../hooks/useAuth";
import { loginSchema } from "../../../schemas/authSchema";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { login, actionLoading: loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const { success, message } = await login(data);

    if (success) {
      toast.success(message);
    } else {
      setLoginError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-95">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
          Welcome to SMS.
        </h1>
        <h2 className="text-base text-center text-gray-800 mb-4">
          Login to access your account
        </h2>

        <form
          className="space-y-5 text-gray-800"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-5">
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
              placeholder="Enter your email"
              {...register("email")}
              errors={errors.email}
            />

            {errors.email && (
              <p className="text-red-600 mt-2">{errors.email.message}</p>
            )}
          </div>

          <div className={`${loginError ? "mb-5" : "mb-7"}`}>
            <div className="flex items-center justify-between sm:text-base text-sm mb-2 font-medium ">
              <label
                htmlFor="password"
                className={`block max-w-fit ${errors.password ? "text-red-600" : "text-gray-900"}`}
              >
                Password
                <span className="text-red-600">*</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-green-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative flex items-center">
              <Input
                className="w-full"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
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

            {errors.password && (
              <p className="text-red-600 mt-2">{errors.password.message}</p>
            )}
          </div>

          {loginError && <p className="text-red-600 mt-0 mb-0">{loginError}</p>}

          <div className="w-full mt-5 mb-7">
            <Button
              className="w-full flex items-center justify-center gap-3"
              type="submit"
              disabled={loading}
            >
              {loading && <ImSpinner8 className="animate-spin text-lg" />}
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
