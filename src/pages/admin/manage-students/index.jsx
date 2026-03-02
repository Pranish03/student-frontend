/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { LuChevronRight, LuEllipsis } from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { fetchAllStudents } from "../../../api/manageStudents";
import { Table } from "../../../components/table/Table";
import { StatusBadge } from "../../../components/StatusBadge";
import { Button } from "../../../components/Button";
import { AddStudentDialog } from "./AddStudentDialog";
import { EditStudentDialog } from "./EditStudentDialog";
import { DeleteStudentDialog } from "./DeleteStudentDialog";
import { ToggleStudentDialog } from "./ToggleStudentDialog";

export const ManageStudents = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editingStudentId, setEditingStudentId] = useState(null);
  const [togglingStudentId, setTogglingStudentId] = useState(null);
  const [deletingStudentId, setDeletingStudentId] = useState(null);

  const { data } = useQuery({
    queryKey: ["students"],
    queryFn: fetchAllStudents,
  });

  const handleActionClick = (event, id) => {
    console.log(id);
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 138 + rect.width,
    });

    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const handleCloseDropdown = () => {
    setSelectedId(null);
  };

  const handleEditClick = () => {
    setEditingStudentId(selectedId);
    handleCloseDropdown();
    setShowEditDialog(true);
  };

  const handleDeleteClick = () => {
    setDeletingStudentId(selectedId);
    handleCloseDropdown();
    setShowDeleteDialog(true);
  };

  const handleToggleClick = () => {
    setTogglingStudentId(selectedId);
    handleCloseDropdown();
    setShowToggleDialog(true);
  };

  const columns = [
    { header: "SN", cell: (info) => info.row.index + 1 },
    { header: "Name", accessorKey: "name" },
    { header: "Email Address", accessorKey: "email" },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (info) => <StatusBadge active={info.getValue()} />,
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
          onClick={(e) => handleActionClick(e, info.row.original._id)}
          className="p-1.5 hover:bg-black/5 rounded-[10px] cursor-pointer relative"
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
          <Link className="text-gray-800 hover:underline" to="/admin">
            admin
          </Link>

          <LuChevronRight />

          <span>students</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Students</h2>

        <div className="float-end">
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowAddDialog(true)}
          >
            <IoAddCircle size={22} />
            Add Student
          </Button>
        </div>

        <Table data={data?.data} columns={columns} />
      </div>

      <AnimatePresence>
        {selectedId && (
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
              className="fixed z-50 flex flex-col bg-white border border-black/20 rounded-[10px] shadow p-1 text-base"
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
                className="text-left text-gray-900"
                onClick={handleEditClick}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                className="text-left text-gray-900"
                onClick={handleToggleClick}
              >
                Toggle Status
              </Button>
              <Button
                variant="ghost-danger"
                className="text-left text-gray-900"
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddDialog && (
          <AddStudentDialog close={() => setShowAddDialog(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDialog && editingStudentId && (
          <EditStudentDialog
            id={editingStudentId}
            close={() => {
              setShowEditDialog(false);
              setEditingStudentId(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToggleDialog && togglingStudentId && (
          <ToggleStudentDialog
            id={togglingStudentId}
            close={() => {
              setShowToggleDialog(false);
              setTogglingStudentId(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteDialog && deletingStudentId && (
          <DeleteStudentDialog
            id={deletingStudentId}
            close={() => {
              setShowDeleteDialog(false);
              setDeletingStudentId(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
