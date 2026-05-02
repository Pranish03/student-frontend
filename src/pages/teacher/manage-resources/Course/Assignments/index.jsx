/* eslint-disable no-unused-vars */
import { useState } from "react";
import { DateTime } from "luxon";
import {
  LuPaperclip,
  LuInbox,
  LuClipboardList,
  LuClock,
  LuCalendar,
  LuDownload,
  LuUsers,
  LuChevronDown,
  LuChevronUp,
  LuEllipsis,
  LuCircleCheck,
  LuCircleAlert,
} from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../../../lib/axios";
import { Button } from "../../../../../components/Button";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import { EditAssignmentDialog } from "./EditAssignmentDialog";
import { DeleteAssignmentDialog } from "./DeleteAssignmentDialog";

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

const fetchSubmissions = async (assignmentId) => {
  try {
    const { data } = await axios.get(`/submissions/assignment/${assignmentId}`);
    return data?.data || [];
  } catch (err) {
    if (err.response?.status === 404) return [];
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

const SubmissionItem = ({ submission, studentName, studentEmail }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 truncate">
          {studentName}
        </p>
        <p className="text-xs text-zinc-400 truncate">{studentEmail}</p>
        <p className="text-xs text-zinc-500 mt-0.5">
          Submitted {DateTime.fromISO(submission.createdAt).toRelative()}
        </p>
      </div>
      {submission.file && (
        <a
          href={submission.file}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-lg hover:bg-green-100 transition-colors shrink-0 ml-3"
        >
          <LuDownload size={12} />
          View
        </a>
      )}
    </div>
  );
};

const AssignmentCard = ({ assignment, courseId, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showSubmissions, setShowSubmissions] = useState(false);

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["submissions", assignment._id],
    queryFn: () => fetchSubmissions(assignment._id),
    enabled: showSubmissions,
    staleTime: 30 * 1000,
  });

  const submissionCount = submissions?.length || 0;

  const isExpired =
    assignment.deadline &&
    DateTime.fromISO(assignment.deadline) < DateTime.now();

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 180 + rect.width,
    });
    setShowDropdown(true);
  };

  const closeDropdown = () => setShowDropdown(false);

  return (
    <>
      <div className="bg-white border border-zinc-200 rounded-[10px] overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                isExpired
                  ? "bg-red-50 border border-red-200"
                  : "bg-orange-50 border border-orange-200"
              }`}
            >
              <LuClipboardList
                size={17}
                className={isExpired ? "text-red-500" : "text-orange-500"}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
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
                    </a>
                  )}
                </div>

                <button
                  onClick={handleDropdownClick}
                  className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-700 transition-colors shrink-0"
                >
                  <LuEllipsis size={16} />
                </button>
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

              <button
                onClick={() => setShowSubmissions(!showSubmissions)}
                className="mt-3 flex items-center gap-2 text-xs font-medium text-zinc-600 hover:text-green-600 transition-colors group"
              >
                <div className="flex items-center gap-1.5 bg-zinc-100 rounded-full px-2.5 py-1 group-hover:bg-green-50 transition-colors">
                  <LuUsers size={12} />
                  <span>
                    {submissionCount} submission
                    {submissionCount !== 1 ? "s" : ""}
                  </span>
                  {showSubmissions ? (
                    <LuChevronUp size={12} />
                  ) : (
                    <LuChevronDown size={12} />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showSubmissions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="border-t border-zinc-100 bg-zinc-50/50"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-zinc-700">
                    Student Submissions
                  </p>
                  <span className="text-xs text-zinc-400">
                    {submissionCount} total
                  </span>
                </div>

                {submissionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-zinc-200 border-t-green-600 rounded-full animate-spin" />
                  </div>
                ) : submissions?.length === 0 ? (
                  <div className="text-center py-8">
                    <LuInbox size={32} className="text-zinc-300 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">No submissions yet</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {submissions.map((submission) => (
                      <SubmissionItem
                        key={submission._id}
                        submission={submission}
                        studentName={submission.student?.name || "Unknown"}
                        studentEmail={submission.student?.email || ""}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              onClick={closeDropdown}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
            <motion.div
              className="fixed z-50 flex flex-col bg-white border border-zinc-300 rounded-[10px] shadow p-1 text-base"
              style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Button
                variant="ghost"
                className="text-left text-zinc-900"
                onClick={() => {
                  closeDropdown();
                  onEdit(assignment);
                }}
              >
                Edit Assignment
              </Button>
              <Button
                variant="ghost-danger"
                className="text-left"
                onClick={() => {
                  closeDropdown();
                  onDelete(assignment);
                }}
              >
                Delete Assignment
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const Assignments = ({ courseId }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deletingAssignment, setDeletingAssignment] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["assignment", courseId],
    queryFn: () => fetchAssignments(courseId),
    staleTime: 2 * 60 * 1000,
  });

  const assignments = data?.resources ?? [];

  const handleEditClick = (assignment) => {
    setEditingAssignment(assignment);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (assignment) => {
    setDeletingAssignment(assignment);
    setShowDeleteDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-zinc-200 border-t-green-600 rounded-full animate-spin" />
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
    <>
      <div className="flex justify-end mb-4">
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowAddDialog(true)}
        >
          <IoAddCircle size={22} />
          Add Assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <LuInbox size={52} className="text-zinc-300 mb-3" />
          <p className="text-zinc-500 font-semibold">No assignments yet</p>
          <p className="text-zinc-400 text-sm mt-1">
            Create your first assignment for this course
          </p>
        </div>
      ) : (
        <div className="space-y-4">
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
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
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
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <AnimatePresence>
        {showAddDialog && (
          <AddAssignmentDialog
            close={() => setShowAddDialog(false)}
            courseId={courseId}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDialog && editingAssignment && (
          <EditAssignmentDialog
            assignment={editingAssignment}
            courseId={courseId}
            close={() => {
              setShowEditDialog(false);
              setEditingAssignment(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteDialog && deletingAssignment && (
          <DeleteAssignmentDialog
            assignment={deletingAssignment}
            close={() => {
              setShowDeleteDialog(false);
              setDeletingAssignment(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
