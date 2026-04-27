import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  LuUpload,
  LuCheck,
  LuClock,
  LuCircleAlert,
  LuRefreshCw,
} from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";
import { DateTime } from "luxon";
import { axios } from "../../../../../lib/axios";
import { Dialog } from "../../../../../components/Dialog";
import { Button } from "../../../../../components/Button";

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

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export const SubmitDialog = ({
  assignment,
  existingSubmission,
  courseId,
  close,
}) => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

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
        queryKey: ["student-submissions", courseId],
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

  const handleFile = (f) => {
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      toast.error("Only PDF, DOCX, or PPTX files are allowed");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10 MB");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

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

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() =>
            !mutation.isPending &&
            document.getElementById("submit-file-input").click()
          }
          className={`
            relative border-2 border-dashed rounded-[10px] p-8 text-center cursor-pointer transition-all duration-150
            ${dragOver ? "border-green-500 bg-green-50" : "border-zinc-300 hover:border-green-400 hover:bg-zinc-50"}
            ${mutation.isPending ? "opacity-60 pointer-events-none" : ""}
          `}
        >
          <input
            id="submit-file-input"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            className="hidden"
            disabled={mutation.isPending}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <LuCheck size={20} className="text-green-600" />
              </div>
              <p className="font-medium text-zinc-900 text-sm break-all">
                {file.name}
              </p>
              <p className="text-xs text-zinc-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-xs text-red-500 hover:underline mt-1"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <LuUpload size={20} className="text-zinc-500" />
              </div>
              <p className="font-medium text-zinc-700 text-sm">
                Drag & drop or click to upload
              </p>
              <p className="text-xs text-zinc-400">
                PDF, DOCX, or PPTX · Max 10 MB
              </p>
            </div>
          )}
        </div>

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
