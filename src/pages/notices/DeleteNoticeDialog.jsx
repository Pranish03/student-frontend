import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../components/Dialog";
import { Button } from "../../components/Button";
import { deleteNotice } from "../../api/notices";

export const DeleteNoticeDialog = ({ notice, close }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: (data) => {
      toast.success(data?.message || "Notice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      close();
    },
  });

  return (
    <Dialog
      heading="Delete Notice"
      desc="Are you sure you want to delete this notice? This action cannot be undone."
      close={close}
    >
      {mutation?.isError && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-base">
            {mutation?.error?.response?.data?.message || "Something went wrong"}
          </p>
        </div>
      )}

      <div className="mb-4 p-4 bg-zinc-50 rounded-[10px] border border-zinc-200">
        <p className="font-medium text-zinc-900 truncate">{notice?.title}</p>
        {notice?.description && (
          <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
            {notice.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 justify-end">
        <Button
          variant="secondary"
          type="button"
          onClick={close}
          disabled={mutation?.isPending}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          type="button"
          className="flex items-center justify-center gap-3 min-w-35"
          onClick={() => mutation.mutate(notice?._id)}
          disabled={mutation?.isPending}
        >
          {mutation?.isPending ? (
            <>
              <ImSpinner8 className="animate-spin text-lg" />
              <span>Deleting...</span>
            </>
          ) : (
            "Delete Notice"
          )}
        </Button>
      </div>
    </Dialog>
  );
};
