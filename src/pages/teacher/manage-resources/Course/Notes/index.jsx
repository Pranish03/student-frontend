/* eslint-disable no-unused-vars */
import { useState } from "react";
import { DateTime } from "luxon";
import { LuEllipsis, LuPaperclip } from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseResources } from "../../../../../api/resources";
import { Table } from "../../../../../components/table/Table";
import { Button } from "../../../../../components/Button";
import { filterSpecificColumns } from "../../../../../utils/tableFilters";
import { AddNoteDialog } from "./AddNoteDialog";
import { EditNoteDialog } from "./EditNoteDialog";
import { DeleteNoteDialog } from "./DeleteNoteDialog";

export const Notes = ({ courseId }) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", courseId],
    queryFn: () => fetchCourseResources({ courseId, type: "note" }),
  });

  const handleActionClick = (e, note) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 125 + rect.width,
    });
    setSelectedNote((prev) => (prev?._id === note._id ? null : note));
  };

  const closeDropdown = () => setSelectedNote(null);

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

  return (
    <>
      <div className="float-end mb-4">
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowAddDialog(true)}
        >
          <IoAddCircle size={22} />
          Add Note
        </Button>
      </div>

      <Table
        data={data?.resources}
        columns={columns}
        globalFilterFn={filterSpecificColumns("title")}
        isLoading={isLoading}
      />

      {/* Dropdown */}
      <AnimatePresence>
        {selectedNote && (
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
                  setEditingNote(selectedNote);
                  closeDropdown();
                  setShowEditDialog(true);
                }}
              >
                Edit Note
              </Button>
              <Button
                variant="ghost-danger"
                className="text-left"
                onClick={() => {
                  setDeletingNote(selectedNote);
                  closeDropdown();
                  setShowDeleteDialog(true);
                }}
              >
                Delete Note
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddDialog && (
          <AddNoteDialog
            close={() => setShowAddDialog(false)}
            courseId={courseId}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDialog && editingNote && (
          <EditNoteDialog
            note={editingNote}
            courseId={courseId}
            close={() => {
              setShowEditDialog(false);
              setEditingNote(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteDialog && deletingNote && (
          <DeleteNoteDialog
            courseId={courseId}
            note={deletingNote}
            close={() => {
              setShowDeleteDialog(false);
              setDeletingNote(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
