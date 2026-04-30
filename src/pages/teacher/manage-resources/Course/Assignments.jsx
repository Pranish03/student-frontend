import { useState } from "react";
import { DateTime } from "luxon";
import { LuEllipsis, LuPaperclip } from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { axios } from "../../../../lib/axios";
import { Table } from "../../../../components/table/Table";
import { Button } from "../../../../components/Button";
import { filterSpecificColumns } from "../../../../utils/tableFilters";
import { AddAssignmentDialog } from "../../manage-assignment/Assignment/AddAssignmentDialog";
import { EditAssignmentDialog } from "../../manage-assignment/Assignment/EditAssignmentDailog";
import { DeleteAssignmentDialog } from "../../manage-assignment/Assignment/DeleteAssignmentDailog";

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

export const Assignments = ({ courseId }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
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

  const handleActionClick = (e, assignment) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 125 + rect.width,
    });
    setSelectedAssignment((prev) =>
      prev?._id === assignment._id ? null : assignment,
    );
  };

  const closeDropdown = () => setSelectedAssignment(null);

  const columns = [
    { header: "SN", cell: (info) => info.row.index + 1 },
    {
      header: "Title",
      accessorKey: "title",
      cell: (info) => (
        <a
          href={info.row.original.file}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-green-700 hover:underline"
        >
          <LuPaperclip size={14} />
          {info.getValue()}
        </a>
      ),
    },
    {
      header: "Deadline",
      accessorKey: "deadline",
      cell: (info) =>
        info.getValue() ? (
          DateTime.fromISO(info.getValue()).toFormat("dd LLL yyyy")
        ) : (
          <span className="text-zinc-400 italic">No deadline</span>
        ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (info) => DateTime.fromISO(info.getValue()).toRelative(),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: (info) => DateTime.fromISO(info.getValue()).toRelative(),
    },
    {
      header: "Action",
      cell: (info) => (
        <button
          onClick={(e) => handleActionClick(e, info.row.original)}
          className="p-1.5 hover:bg-zinc-100 rounded-[10px] cursor-pointer"
        >
          <LuEllipsis size={18} />
        </button>
      ),
    },
  ];

  const rows = data?.resources ?? [];

  return (
    <>
      <div className="float-end mb-4">
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowAddDialog(true)}
        >
          <IoAddCircle size={22} />
          Add Assignment
        </Button>
      </div>

      <Table
        data={rows}
        columns={columns}
        globalFilterFn={filterSpecificColumns("title")}
        isLoading={isLoading}
      />

      {/* Dropdown */}
      <AnimatePresence>
        {selectedAssignment && (
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
                  setEditingAssignment(selectedAssignment);
                  closeDropdown();
                  setShowEditDialog(true);
                }}
              >
                Edit Assignment
              </Button>
              <Button
                variant="ghost-danger"
                className="text-left"
                onClick={() => {
                  setDeletingAssignment(selectedAssignment);
                  closeDropdown();
                  setShowDeleteDialog(true);
                }}
              >
                Delete Assignment
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
