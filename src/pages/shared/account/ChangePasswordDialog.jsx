import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { updatePasswordSchema } from "../../../schemas/authSchema";

export const ChangePasswordDialog = ({ close }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNew: "",
    },
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    close();
  };

  return (
    <Dialog
      heading="Change Password"
      desc="Enter your current password and choose a new strong password to secure your account."
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="current"
              className={`block max-w-fit sm:text-base text-sm mb-2 font-medium ${errors.currentPassword ? "text-red-600" : "text-zinc-900"}`}
            >
              Current Password
              <span className="text-red-600">*</span>
            </label>
          </div>

          <div className="relative flex items-center">
            <Input
              className="w-full pr-10"
              type={showCurrent ? "text" : "password"}
              id="current"
              placeholder="Enter current password"
              {...register("currentPassword")}
              errors={errors?.currentPassword}
            />

            <button
              type="button"
              className="absolute right-3 cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors"
              onClick={() => setShowCurrent((prev) => !prev)}
              tabIndex={-1}
            >
              {showCurrent ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {errors?.currentPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="new"
              className={`block max-w-fit sm:text-base text-sm mb-2 font-medium ${errors.newPassword ? "text-red-600" : "text-zinc-900"}`}
            >
              New Password
              <span className="text-red-600">*</span>
            </label>
          </div>

          <div className="relative flex items-center">
            <Input
              className="w-full pr-10"
              type={showNew ? "text" : "password"}
              id="new"
              placeholder="Enter new password"
              {...register("newPassword")}
              errors={errors?.newPassword}
            />

            <button
              type="button"
              className="absolute right-3 cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors"
              onClick={() => setShowNew((prev) => !prev)}
              tabIndex={-1}
            >
              {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {errors?.newPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="confirm"
              className={`block max-w-fit sm:text-base text-sm mb-2 font-medium ${errors.confirmNew ? "text-red-600" : "text-zinc-900"}`}
            >
              Confirm New Password
              <span className="text-red-600">*</span>
            </label>
          </div>

          <div className="relative flex items-center">
            <Input
              className="w-full pr-10"
              type={showConfirm ? "text" : "password"}
              id="confirm"
              placeholder="Confirm new password"
              {...register("confirmNew")}
              errors={errors?.confirmNew}
            />

            <button
              type="button"
              className="absolute right-3 cursor-pointer text-zinc-400 hover:text-zinc-600 transition-colors"
              onClick={() => setShowConfirm((prev) => !prev)}
              tabIndex={-1}
            >
              {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {errors?.confirmNew && (
            <p className="text-red-600 text-sm mt-1">
              {errors.confirmNew.message}
            </p>
          )}
        </div>

        <div className="mb-6 p-3 bg-green-50 rounded-lg">
          <p className="text-base font-medium text-green-600 mb-2">
            Password requirements
          </p>
          <ul className="text-sm text-green-600 space-y-1 list-disc pl-4 [&>li::marker]:text-green-600">
            <li>At least 8 characters long</li>
            <li>Contains at least one uppercase letter</li>
            <li>Contains at least one number</li>
            <li>Contains at least one special character</li>
          </ul>
        </div>

        {/* Action Buttons */}
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
            className="flex items-center justify-center gap-3 min-w-35"
            type="submit"
          >
            Change Password
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
