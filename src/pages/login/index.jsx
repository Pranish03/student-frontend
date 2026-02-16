import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginSchema } from "../../schemas/auth-schema";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const [serverError, setServerError] = useState("");

  const onSubmit = (data) => {
    console.log(data);
    reset();
    setServerError("Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-[430px]">
        <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
        <h2 className="text-lg font-medium text-center text-black mb-6">
          Get access to your account
        </h2>

        <form
          className="space-y-4 text-gray-800"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="email"
              className="block max-w-fit text-sm text-gray-800 sm:text-base font-medium mb-2"
            >
              Email*
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
              <p className="text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between sm:text-base text-sm mb-2">
              <label
                htmlFor="password"
                className="block max-w-fit text-gray-800 font-medium"
              >
                Password*
              </label>

              <Link className="text-green-600 hover:underline">
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
              <p className="text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-red-600 mt-1">{serverError}</p>}

          <Button type="submit" className="w-full mt-1">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};
