import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../../../components/Dialog";
import { Button } from "../../../../components/Button";
import {
  fetchScheduleByClass,
  deleteScheduleEntry,
} from "../../../../api/manageSchedule";

export const DeleteEntryDialog = ({ classData, entry, close }) => {
  const queryClient = useQueryClient();

  const { data: scheduleData } = useQuery({
    queryKey: ["schedule", classData?._id],
    queryFn: () => fetchScheduleByClass(classData?._id),
  });

  const schedule = scheduleData?.data;

  const mutation = useMutation({
    mutationFn: deleteScheduleEntry,
    onSuccess: (data) => {
      toast.success(data?.message || "Entry deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["schedule", classData?._id] });
      close();
    },
  });

  const handleDelete = () =>
    mutation.mutate({ scheduleId: schedule._id, entryId: entry._id });

  return (
    <Dialog
      heading="Delete Entry"
      desc="Are you sure you want to delete this schedule entry?"
      close={close}
    >
      {mutation?.isError && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-base">
            {mutation?.error?.response?.data?.message || "Something went wrong"}
          </p>
        </div>
      )}

      <div className="mb-4 p-4 bg-zinc-50 rounded-[10px]">
        <p className="font-medium text-zinc-900">{entry.course?.name}</p>
        <p className="text-sm text-zinc-600">
          {entry.day}, {entry.startTime} - {entry.endTime}
        </p>
        <p className="text-xs text-zinc-500">Room: {entry.room}</p>
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
          className="flex items-center justify-center gap-3 min-w-30"
          onClick={handleDelete}
          disabled={mutation?.isPending}
        >
          {mutation?.isPending ? (
            <>
              <ImSpinner8 className="animate-spin text-lg" />
              <span>Deleting...</span>
            </>
          ) : (
            "Delete Entry"
          )}
        </Button>
      </div>
    </Dialog>
  );
};
