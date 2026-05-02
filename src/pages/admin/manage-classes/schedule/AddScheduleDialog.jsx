import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../../../components/Dialog";
import { Button } from "../../../../components/Button";
import { createScheduleSchema } from "../../../../schemas/scheduleSchema";
import { createSchedule } from "../../../../api/manageSchedule";

export const AddScheduleDialog = ({ classData, close }) => {
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    // formState: { errors },
  } = useForm({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      class: classData?._id,
      timeTable: [],
    },
  });

  const mutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: (data) => {
      toast.success(data?.message || "Schedule created successfully");
      queryClient.invalidateQueries({ queryKey: ["schedule", classData?._id] });
      close();
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <Dialog
      heading="Create Schedule"
      desc="Create a new schedule for this class"
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mutation?.isError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-base">
              {mutation?.error?.response?.data?.message ||
                "Something went wrong"}
            </p>
          </div>
        )}

        <p className="text-zinc-600">
          You're about to create a schedule for{" "}
          <span className="font-semibold">{classData?.name}</span>. You can add
          timetable entries after creation.
        </p>

        <div className="flex items-center gap-4 justify-end pt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={close}
            disabled={mutation?.isPending}
          >
            Cancel
          </Button>
          <Button
            className="flex items-center justify-center gap-3 min-w-30"
            type="submit"
            disabled={mutation?.isPending}
          >
            {mutation?.isPending ? (
              <>
                <ImSpinner8 className="animate-spin text-lg" />
                <span>Creating...</span>
              </>
            ) : (
              "Create Schedule"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
