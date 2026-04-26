/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { LuChevronRight, LuEllipsis, LuInbox } from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im";

import { fetchAllNotices } from "../../../api/notices";
import { Button } from "../../../components/Button";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";
import { AddNoticeDialog } from "./AddNoticeDialog";
import { EditNoticeDialog } from "./EditNoticeDialog";
import { DeleteNoticeDialog } from "./DeleteNoticeDialog";
import { NoticeCard } from "./NoticeCard";

const FILTERS = [
  { label: "All", value: "all-filter" },
  { label: "Everyone", value: "all" },
  { label: "Students", value: "student" },
  { label: "Teachers", value: "teacher" },
];

export const ManageNotices = () => {
  const [activeFilter, setActiveFilter] = useState("all-filter");

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editingNotice, setEditingNotice] = useState(null);
  const [deletingNotice, setDeletingNotice] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: fetchAllNotices,
  });

  const notices = data?.data ?? [];

  const filtered =
    activeFilter === "all-filter"
      ? notices
      : notices.filter((n) => n.targetRole === activeFilter);

  const handleActionClick = (e, notice) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 130 + rect.width,
    });
    setSelectedNotice((prev) => (prev?._id === notice._id ? null : notice));
  };

  const closeDropdown = () => setSelectedNotice(null);

  const handleEditClick = () => {
    setEditingNotice(selectedNotice);
    closeDropdown();
    setShowEditDialog(true);
  };

  const handleDeleteClick = () => {
    setDeletingNotice(selectedNotice);
    closeDropdown();
    setShowDeleteDialog(true);
  };

  return (
    <>
      <Container>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mb-4">
          <Link
            className="text-zinc-500 hover:underline hover:text-zinc-900"
            to="/admin"
          >
            Admin
          </Link>
          <LuChevronRight />
          <span className="text-zinc-900">Notices</span>
        </div>

        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Heading className="mb-1">Notices</Heading>
            <Paragraph>
              {isLoading
                ? "Loading..."
                : `${notices.length} total notice${notices.length !== 1 ? "s" : ""}`}
            </Paragraph>
          </div>
          <Button
            className="flex items-center gap-2 mt-1 shrink-0"
            onClick={() => setShowAddDialog(true)}
          >
            <IoAddCircle size={22} />
            Add Notice
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="bg-zinc-100 p-1 mb-6 rounded-[14px] w-min border border-zinc-200">
          <nav className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3 py-1.5 rounded-[10px] text-sm font-medium transition-all cursor-pointer whitespace-nowrap
                  ${
                    activeFilter === f.value
                      ? "text-green-600 bg-white border-zinc-200 shadow"
                      : "text-zinc-700 hover:text-zinc-800 hover:bg-zinc-50"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Notice list */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <ImSpinner8 size={35} className="animate-spin text-green-600" />
            <p className="mt-3 text-zinc-500">Loading notices...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <LuInbox size={64} className="text-zinc-300" />
            <p className="text-zinc-500 font-semibold text-lg mt-2">
              No notices found
            </p>
            <p className="text-zinc-400 text-sm">
              {activeFilter !== "all-filter"
                ? "Try selecting a different filter"
                : "Click 'Add Notice' to publish your first one"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((notice) => (
              <NoticeCard
                key={notice._id}
                notice={notice}
                actions={
                  <button
                    onClick={(e) => handleActionClick(e, notice)}
                    className="p-1.5 hover:bg-zinc-100 rounded-[10px] cursor-pointer text-zinc-500"
                  >
                    <LuEllipsis size={18} />
                  </button>
                }
              />
            ))}
          </div>
        )}
      </Container>

      {/* Dropdown menu */}
      <AnimatePresence>
        {selectedNotice && (
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
                onClick={handleEditClick}
              >
                Edit
              </Button>
              <Button
                variant="ghost-danger"
                className="text-left"
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      <AnimatePresence>
        {showAddDialog && (
          <AddNoticeDialog close={() => setShowAddDialog(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDialog && editingNotice && (
          <EditNoticeDialog
            notice={editingNotice}
            close={() => {
              setShowEditDialog(false);
              setEditingNotice(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteDialog && deletingNotice && (
          <DeleteNoticeDialog
            notice={deletingNotice}
            close={() => {
              setShowDeleteDialog(false);
              setDeletingNotice(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
