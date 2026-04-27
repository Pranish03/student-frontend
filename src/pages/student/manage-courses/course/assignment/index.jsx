import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { AnimatePresence } from "framer-motion";
import {
  LuPaperclip,
  LuInbox,
  LuClipboardList,
  LuClock,
  LuCalendar,
  LuUpload,
  LuRefreshCw,
  LuCircleCheck,
  LuCircleAlert,
  LuExternalLink,
} from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";
import { useAuth } from "../../../../../hooks/useAuth";
import { axios } from "../../../../../lib/axios";
import { Button } from "../../../../../components/Button";
import { SubmitDialog } from "./SubmitDialog";

const fetchAssignments = async (courseId) => {
  try {
    const { data } = await axios.get(
      `/resources/course/${courseId}?type=assignment`,
    );
    return data;
  } catch (err) {
    if (err.response?.status === 404) return { resources: [] };
    throw err;
  }
};

const DeadlineBadge = ({ deadline }) => {
  if (!deadline) return null;
  const dt = DateTime.fromISO(deadline);
  const now = DateTime.now();
  const diff = dt.diff(now, "days").days;
  const formatted = dt.toFormat("dd LLL yyyy");

  let cls = "bg-zinc-50 text-zinc-500 border-zinc-200";
  let Icon = LuCalendar;
  let label = formatted;

  if (diff < 0) {
    cls = "bg-red-50 text-red-500 border-red-200";
    Icon = LuCircleAlert;
    label = `Expired · ${formatted}`;
  } else if (diff <= 1) {
    cls = "bg-red-50 text-red-500 border-red-200";
    Icon = LuClock;
    label = `Due today · ${formatted}`;
  } else if (diff <= 3) {
    cls = "bg-amber-50 text-amber-600 border-amber-200";
    Icon = LuClock;
    label = `${Math.ceil(diff)}d left · ${formatted}`;
  } else {
    cls = "bg-green-50 text-green-600 border-green-200";
    label = formatted;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-full ${cls}`}
    >
      <Icon size={11} />
      {label}
    </span>
  );
};

const AssignmentCard = ({ assignment }) => {
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  const { data: submissionData, isLoading: submissionLoading } = useQuery({
    queryKey: ["student-submission", assignment._id, user?._id],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `/submissions/assignment/${assignment._id}`,
        );
        const mine = data?.data?.find(
          (s) => s.student?._id === user?._id || s.student === user?._id,
        );
        return mine ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!assignment._id && !!user?._id,
    staleTime: 60 * 1000,
  });

  const isExpired =
    assignment.deadline &&
    DateTime.fromISO(assignment.deadline) < DateTime.now();

  const hasSubmission = !!submissionData;

  return (
    <>
      <div className="bg-white border border-zinc-200 rounded-[10px] p-5 hover:border-zinc-300 hover:shadow-sm transition-all duration-150">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              hasSubmission
                ? "bg-green-50 border border-green-200"
                : isExpired
                  ? "bg-red-50 border border-red-200"
                  : "bg-orange-50 border border-orange-200"
            }`}
          >
            <LuClipboardList
              size={17}
              className={
                hasSubmission
                  ? "text-green-600"
                  : isExpired
                    ? "text-red-500"
                    : "text-orange-500"
              }
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-zinc-900 text-sm leading-snug">
                  {assignment.title}
                </p>
                {assignment.file && (
                  <a
                    href={assignment.file}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-green-600 hover:underline mt-0.5"
                  >
                    <LuPaperclip size={11} />
                    View assignment file
                    <LuExternalLink size={10} />
                  </a>
                )}
              </div>

              {submissionLoading ? (
                <ImSpinner8
                  size={14}
                  className="animate-spin text-zinc-400 shrink-0 mt-1"
                />
              ) : hasSubmission ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full shrink-0">
                  <LuCricleCheck size={12} />
                  Submitted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-zinc-50 text-zinc-500 border border-zinc-200 px-2.5 py-1 rounded-full shrink-0">
                  Not submitted
                </span>
              )}
            </div>

            {assignment.description && (
              <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2">
                {assignment.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <DeadlineBadge deadline={assignment.deadline} />
              <span className="text-xs text-zinc-400">
                Posted {DateTime.fromISO(assignment.createdAt).toRelative()}
              </span>
            </div>

            {hasSubmission && submissionData && (
              <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-green-700">
                    Your submission
                  </p>
                  <p className="text-xs text-green-600">
                    Submitted{" "}
                    {DateTime.fromISO(submissionData.createdAt).toRelative()}
                  </p>
                </div>
                {submissionData.file && (
                  <a
                    href={submissionData.file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-green-700 underline flex items-center gap-1 shrink-0"
                  >
                    View file
                    <LuExternalLink size={10} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
          <Button
            onClick={() => setShowDialog(true)}
            variant={hasSubmission ? "secondary" : "primary"}
            className="flex items-center gap-2 text-sm"
            disabled={isExpired && !hasSubmission}
            title={
              isExpired && !hasSubmission ? "Deadline has passed" : undefined
            }
          >
            {hasSubmission ? (
              <>
                <LuRefreshCw size={14} />
                Resubmit
              </>
            ) : (
              <>
                <LuUpload size={14} />
                Submit Assignment
              </>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showDialog && (
          <SubmitDialog
            assignment={assignment}
            existingSubmission={submissionData ?? null}
            close={() => setShowDialog(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export const Assignments = ({ courseId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["student-assignments", courseId],
    queryFn: () => fetchAssignments(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
  });

  const assignments = data?.resources ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <ImSpinner8 size={28} className="animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 text-sm">
          Failed to load assignments. Please try again.
        </p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <LuInbox size={52} className="text-zinc-300 mb-3" />
        <p className="text-zinc-500 font-semibold">No assignments yet</p>
        <p className="text-zinc-400 text-sm mt-1">
          Your teacher hasn&apos;t uploaded any assignments for this course yet
        </p>
      </div>
    );
  }

  const pending = assignments.filter(
    (a) => !a.deadline || DateTime.fromISO(a.deadline) >= DateTime.now(),
  );
  const expired = assignments.filter(
    (a) => a.deadline && DateTime.fromISO(a.deadline) < DateTime.now(),
  );

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section>
          <p className="text-sm font-medium text-zinc-600 mb-3">
            Active · {pending.length}
          </p>
          <div className="space-y-3">
            {pending.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                courseId={courseId}
              />
            ))}
          </div>
        </section>
      )}

      {expired.length > 0 && (
        <section>
          <p className="text-sm font-medium text-zinc-400 mb-3">
            Expired · {expired.length}
          </p>
          <div className="space-y-3 opacity-75">
            {expired.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                courseId={courseId}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
