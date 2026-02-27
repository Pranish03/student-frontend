import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { resetPasswordSchema } from "../../../schemas/authSchema";
import { axios } from "../../../lib/axios";
import { toast } from "sonner";

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirm: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post(`/auth/reset-password/${token}`, data);
      toast.success(res.data?.message);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-95">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
          Reset password.
        </h1>
        <p className="text-base text-center text-gray-800 mb-4">
          Create and confirm your new password
        </p>

        <form className="text-gray-800" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
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

          <div className={`${error ? "mb-5" : "mb-7"}`}>
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

          {error && <p className="text-red-600 mt-0 mb-0">{error}</p>}

          <div className="w-full mt-5 mb-7">
            <Button
              className="w-full flex items-center justify-center gap-3"
              type="submit"
              disabled={loading}
            >
              {loading && <ImSpinner8 className="animate-spin text-lg" />}
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
