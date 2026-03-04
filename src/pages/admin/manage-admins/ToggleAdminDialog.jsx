import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../../components/Dialog";
import { toggleUser } from "../../../api/manageUsers";
import { Button } from "../../../components/Button";

export const ToggleAdminDialog = ({ admin, close }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: toggleUser,
    onSuccess: (data) => {
      toast.success(data?.message || "Admin status changed successfully");

      queryClient.invalidateQueries({ queryKey: ["admins"] });

      close();
    },
  });

  const handleToggle = () => mutation.mutate(admin?._id);

  return (
    <Dialog
      heading={`${admin?.isActive ? "Deactivate" : "Activate"} Admin`}
      desc={`Are you sure you want to ${admin?.isActive ? "deactivate" : "activate"} this admin?`}
      close={close}
    >
      {mutation?.isError && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-base">
            {mutation?.error?.response?.data?.message || "Something went wrong"}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 justify-end">
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            close();
          }}
          disabled={mutation?.isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="flex items-center justify-center gap-3 min-w-35"
          onClick={handleToggle}
          disabled={mutation?.isPending}
        >
          {mutation?.isPending && (
            <ImSpinner8 className="animate-spin text-lg" />
          )}
          <span>{admin?.isActive ? "Deactivate" : "Activate"}</span>
        </Button>
      </div>
    </Dialog>
  );
};
