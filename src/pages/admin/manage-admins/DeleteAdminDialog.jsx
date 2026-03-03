import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../../components/Dialog";
import { deleteUser } from "../../../api/manageUsers";
import { Button } from "../../../components/Button";

export const DeleteAdminDialog = ({ id, close }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      toast.success(data?.message || "Admin deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["admins"] });

      close();
    },
  });

  const handleDelete = () => mutation.mutate(id);

  return (
    <Dialog
      heading="Delete Admin"
      desc="Are you sure you want to delete this admin?"
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
          variant="danger"
          type="button"
          className="flex items-center justify-center gap-3 min-w-35"
          onClick={handleDelete}
          disabled={mutation?.isPending}
        >
          {mutation?.isPending ? (
            <>
              <ImSpinner8 className="animate-spin text-lg" />
              <span>Delete...</span>
            </>
          ) : (
            "Delete Admin"
          )}
        </Button>
      </div>
    </Dialog>
  );
};
