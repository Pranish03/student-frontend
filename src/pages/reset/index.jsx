import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Reset Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-[430px]">
        <h1 className="text-3xl font-bold text-center mb-2">
          Reset Your Password
        </h1>

        <h2 className="text-lg font-medium text-center mb-6">
          Enter your new password
        </h2>

        <form className="space-y-4  text-gray-800" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Password*
            </label>

            <div className="relative flex items-center">
              <Input
                className="w-full"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...register("password")}
              />

              <button
                type="button"
                className="absolute right-3 text-gray-400 hover:text-green-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password*
            </label>

            <div className="relative flex items-center">
              <Input
                className="w-full"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
              />

              <button
                type="button"
                className="absolute right-3 text-gray-400 hover:text-green-600"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full mt-1">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}