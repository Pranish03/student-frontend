import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { DateTime } from "luxon";
import { LuChevronRight, LuEllipsis } from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { Button } from "../../../components/Button";
import { Table } from "../../../components/table/Table";
import { AddNoteDialog } from "./AddNoteDialog";
import { EditNotesDialog } from "./EditNotesDialog";
import { DeleteNoteDialog } from "./DeleteNoteDialog";

export const ManageNotes = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editingNote, setEditingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);

  const data = {
    data: [
      {
        _id: "1",
        title: "React Basics",
        file: "/notes/react.pdf",
        createdAt: "2026-03-10T10:00:00Z",
        updatedAt: "2026-03-11T10:00:00Z",
      },
      {
        _id: "2",
        title: "OS Basics",
        file: "/notes/OS.pdf",
        createdAt: "2026-02-10T10:00:00Z",
        updatedAt: "2026-02-11T10:00:00Z",
      },
    ],
  };

  const isLoading = false;

  const handleActionClick = (event, note) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setSelectedNote((prev) => (prev === note ? null : note));
  };

  const handleCloseDropdown = () => setSelectedNote(null);

   const handleEditClick = () => {
    setEditingNote(selectedNote);
    handleCloseDropdown();
    setShowEditDialog(true);
  };

  const handleDeleteClick = () => {
    setDeletingNote(selectedNote);
    handleCloseDropdown();
    setShowDeleteDialog(true);
  };


  const columns = [
    { header: "SN", cell: (info) => info.row.index + 1 },

    {
      header: "Title",
      accessorKey: "title",
      cell: (info) => (
        <a
          href={info.row.original.file}
          target="_blank"
          className="text-blue-600 underline"
        >
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
      <div>
        <div className="flex items-center gap-1 mb-4">
          <Link
            className="text-zinc-500 hover:underline hover:text-zinc-900"
            to="/teacher"
          >
            Teacher
          </Link>
          <LuChevronRight />
          <span className="text-zinc-900">Notes</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-1">Notes</h1>
          <p className="text-zinc-800">{data?.data?.length || 0} total notes</p>
        </div>

        <div className="float-end">
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowAddDialog(true)}
          >
            <IoAddCircle size={22} />
            Add Notes
          </Button>
        </div>

        <Table data={data?.data} columns={columns} isLoading={isLoading} />
      </div>

      <AnimatePresence>
        {selectedNote && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              onClick={handleCloseDropdown}
            />
            <motion.div
              className="fixed z-50 flex flex-col bg-white border border-zinc-300 rounded-[10px] shadow p-1 text-base"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
            >
              <Button variant="ghost" onClick={handleEditClick}>
                Edit
              </Button>

              <Button variant="ghost-danger" onClick={handleDeleteClick}>
                Delete
              </Button>
            </motion.div>
          </>
        )}
       </AnimatePresence>

      <AnimatePresence>
        {showAddDialog && (
          <AddNoteDialog close={() => setShowAddDialog(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDialog && editingNote && (
          <EditNotesDialog
            note={editingNote}
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