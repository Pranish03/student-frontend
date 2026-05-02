/* eslint-disable no-unused-vars */
import { useState } from "react";
import { DateTime } from "luxon";
import {
  LuPaperclip,
  LuInbox,
  LuFileText,
  LuClock,
  LuDownload,
  LuEllipsis,
} from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseResources } from "../../../../../api/resources";
import { Button } from "../../../../../components/Button";
import { AddNoteDialog } from "./AddNoteDialog";
import { EditNoteDialog } from "./EditNoteDialog";
import { DeleteNoteDialog } from "./DeleteNoteDialog";

const NoteCard = ({ note, index, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 110 + rect.width,
    });
    setShowDropdown(true);
  };

  const closeDropdown = () => setShowDropdown(false);

  return (
    <>
      <div
        className="bg-white border border-zinc-200 rounded-[10px] p-4 hover:border-zinc-300 hover:shadow-sm transition-all duration-150"
        style={{ animationDelay: `${index * 40}ms` }}
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
            <LuFileText size={17} className="text-blue-600" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-semibold text-zinc-900 text-sm leading-snug">
                  {note.title}
                </p>
              </div>

              <button
                onClick={handleDropdownClick}
                className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-700 transition-colors shrink-0"
              >
                <LuEllipsis size={16} />
              </button>
            </div>

            {note.description && (
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                {note.description}
              </p>
            )}

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <LuClock size={11} />
                {DateTime.fromISO(note.createdAt).toRelative()}
              </span>
            </div>
          </div>

          {note.file && (
            <a
              href={note.file}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors shrink-0"
            >
              <LuDownload size={13} />
              Download
            </a>
          )}
        </div>
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
                  onEdit(note);
                }}
              >
                Edit Note
              </Button>
              <Button
                variant="ghost-danger"
                className="text-left"
                onClick={() => {
                  closeDropdown();
                  onDelete(note);
                }}
              >
                Delete Note
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const Notes = ({ courseId }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", courseId],
    queryFn: () => fetchCourseResources({ courseId, type: "note" }),
  });

  const notes = data?.resources ?? [];

  const handleEditClick = (note) => {
    setEditingNote(note);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (note) => {
    setDeletingNote(note);
    setShowDeleteDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-zinc-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          className="flex items-center gap-2"
          onClick={() => setShowAddDialog(true)}
        >
          <IoAddCircle size={22} />
          Add Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <LuInbox size={52} className="text-zinc-300 mb-3" />
          <p className="text-zinc-500 font-semibold">No notes yet</p>
          <p className="text-zinc-400 text-sm mt-1">
            Upload your first note for this course
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note, i) => (
            <NoteCard
              key={note._id}
              note={note}
              index={i}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
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
