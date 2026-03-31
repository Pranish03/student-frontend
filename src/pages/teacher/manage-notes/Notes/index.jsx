/* eslint-disable no-unused-vars */
import { Link, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { LuChevronRight, LuEllipsis, LuPaperclip } from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { filterSpecificColumns } from "../../../../utils/tableFilters";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseNotes } from "../../../../api/notes";
import { Table } from "../../../../components/table/Table";
import { Container } from "../../../../components/ui/Container";
import { Heading } from "../../../../components/ui/Heading";
import { Paragraph } from "../../../../components/ui/Paragraph";
import { Button } from "../../../../components/Button";
import { useState } from "react";
import { AddNoteDialog } from "./AddNoteDialog";
import { DeleteNoteDialog } from "./DeleteNoteDailog";
import { EditNoteDialog } from "./EditNoteDailog";

export const Notes = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editingNote, setEditingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);

  const { id: courseId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["notes", courseId],
    queryFn: () => fetchCourseNotes(courseId),
  });

  const handleActionClick = (event, id) => {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 125 + rect.width,
    });

    setSelectedNote((prevId) => (prevId === id ? null : id));
  };

  const handleCloseDropdown = () => {
    setSelectedNote(null);
  };

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
          className="flex items-center gap-2"
        >
          <LuPaperclip />
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
          className="p-1.5 hover:bg-zinc-100 rounded-[10px] cursor-pointer relative"
        >
          <LuEllipsis size={18} />
        </button>
      ),
    },
  ];

  return (
    <>
      <Container>
        <div className="flex items-center gap-1 mb-4">
          <Link
            className="text-zinc-500 hover:underline hover:text-zinc-900"
            to="/teacher"
          >
            Teacher
          </Link>

          <LuChevronRight />

          <Link
            className="text-zinc-500 hover:underline hover:text-zinc-900"
            to="/teacher/manage-notes"
          >
            Notes
          </Link>

          <LuChevronRight />

          <span className="text-zinc-900"></span>
        </div>

        <div className="mb-8">
          <Heading className="text-3xl font-bold text-zinc-900 mb-1">
            Notes
          </Heading>
          <Paragraph>Total {data?.data?.length || 0} Notes</Paragraph>
        </div>

        <div className="float-end">
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
      </Container>

      <AnimatePresence>
        {selectedNote && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              onClick={handleCloseDropdown}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
            <motion.div
              className="fixed z-50 flex flex-col bg-white border border-zinc-300 rounded-[10px] shadow p-1 text-base"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{
                duration: 0.18,
                ease: "easeOut",
              }}
            >
              <Button
                variant="ghost"
                className="text-left text-zinc-900"
                onClick={handleEditClick}
              >
                Edit Note
              </Button>
              <Button
                variant="ghost-danger"
                className="text-left"
                onClick={handleDeleteClick}
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
