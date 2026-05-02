import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LuUpload, LuClock, LuCircleAlert, LuRefreshCw } from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";
import { DateTime } from "luxon";
import { axios } from "../../../../../lib/axios";
import { Dialog } from "../../../../../components/Dialog";
import { Button } from "../../../../../components/Button";
import { FileInput } from "../../../../../components/form/FileInput";

const submitAssignment = async ({ assignmentId, file }) => {
  const formData = new FormData();
  formData.append("assignment", assignmentId);
  formData.append("file", file);
  const { data } = await axios.post("/submissions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const resubmitAssignment = async ({ submissionId, file }) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.patch(`/submissions/${submissionId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const SubmitDialog = ({
  assignment,
  existingSubmission,
  courseId,
  close,
}) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);

  const isResubmit = !!existingSubmission;

  const mutation = useMutation({
    mutationFn: isResubmit ? resubmitAssignment : submitAssignment,
    onSuccess: (data) => {
      toast.success(
        data?.message ||
          (isResubmit
            ? "Assignment resubmitted successfully!"
            : "Assignment submitted successfully!"),
      );
      queryClient.invalidateQueries({
        queryKey: ["student-submission", assignment._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["student-assignments", courseId],
      });
      close();
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          (isResubmit ? "Failed to resubmit" : "Failed to submit"),
      );
    },
  });

  const handleSubmit = () => {
    if (!file) return;
    if (isResubmit) {
      mutation.mutate({ submissionId: existingSubmission._id, file });
    } else {
      mutation.mutate({ assignmentId: assignment._id, file });
    }
  };

  const isExpired =
    assignment.deadline &&
    DateTime.fromISO(assignment.deadline) < DateTime.now();

  return (
    <Dialog
      heading={isResubmit ? "Resubmit Assignment" : "Submit Assignment"}
      desc={assignment.title}
      close={close}
    >
      <div className="space-y-4">
        {mutation.isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-[10px]">
            <p className="text-red-600 text-sm">
              {mutation.error?.response?.data?.message ||
                "Something went wrong"}
            </p>
          </div>
        )}

        {assignment.deadline && (
          <div
            className={`flex items-center gap-2 p-3 rounded-[10px] border text-sm ${
              isExpired
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-amber-50 border-amber-200 text-amber-700"
            }`}
          >
            {isExpired ? (
              <LuCircleAlert size={15} className="shrink-0" />
            ) : (
              <LuClock size={15} className="shrink-0" />
            )}
            <span>
              Deadline:{" "}
              <span className="font-semibold">
                {DateTime.fromISO(assignment.deadline).toFormat("dd LLL yyyy")}
              </span>
              {isExpired && " — This assignment has expired"}
            </span>
          </div>
        )}

        {isResubmit && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-[10px]">
            <p className="text-blue-700 text-sm flex items-center gap-2">
              <LuRefreshCw size={14} />
              You&apos;re replacing your previous submission. The old file will
              be deleted.
            </p>
          </div>
        )}

        <FileInput
          onChange={(files) => setFile(files?.[0] ?? null)}
          disabled={mutation.isPending}
        />

        <div className="flex items-center gap-3 justify-end pt-1">
          <Button
            variant="secondary"
            type="button"
            onClick={close}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="flex items-center justify-center gap-2 min-w-32"
            onClick={handleSubmit}
            disabled={!file || mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <ImSpinner8 className="animate-spin" size={14} />
                {isResubmit ? "Resubmitting..." : "Submitting..."}
              </>
            ) : (
              <>
                {isResubmit ? (
                  <LuRefreshCw size={14} />
                ) : (
                  <LuUpload size={14} />
                )}
                {isResubmit ? "Resubmit" : "Submit"}
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
