import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../../components/Dialog";
import { toggleUser } from "../../../api/manageUsers";
import { Button } from "../../../components/Button";
import { useUser } from "../../../hooks/useUser";

export const ToggleTeacherDialog = ({ id, close }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useUser(id);

  console.log(data);

  const mutation = useMutation({
    mutationFn: toggleUser,
    onSuccess: (data) => {
      toast.success(data?.message || "Teacher status changed successfully");

      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });

      close();
    },
  });

  const handleToggle = () => mutation.mutate(id);

  if (isLoading) {
    return (
      <Dialog
        heading={`${data?.data?.isActive ? "Deactivate" : "Activate"} Teacher`}
        desc="Loading teacher information..."
        close={close}
      >
        <div className="flex justify-center items-center py-8">
          <ImSpinner8 className="animate-spin text-3xl text-gray-500" />
        </div>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog
        heading={`${data?.data?.isActive ? "Deactivate" : "Activate"} Teacher`}
        desc="Failed to load teacher information"
        close={close}
      >
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Could not load teacher data</p>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      heading={`${data?.data?.isActive ? "Deactivate" : "Activate"} Teacher`}
      desc={`Are you sure you want to ${data?.data?.isActive ? "deactivate" : "activate"} this teacher?`}
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
          <span>{data?.data?.isActive ? "Deactivate" : "Activate"}</span>
        </Button>
      </div>
    </Dialog>
  );
};
