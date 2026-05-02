/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { LuChevronRight, LuEllipsis } from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { fetchAllTeachers } from "../../../api/manageUsers";
import { Table } from "../../../components/table/Table";
import { StatusBadge } from "../../../components/StatusBadge";
import { Button } from "../../../components/Button";
import { AddTeacherDialog } from "./AddTeacherDialog";
import { EditTeacherDialog } from "./EditTeacherDialog";
import { ToggleTeacherDialog } from "./ToggleTeacherDialog";
import { DeleteTeacherDialog } from "./DeleteTeacherDialog";
import { filterSpecificColumns } from "../../../utils/tableFilters";
import { Container } from "../../../components/ui/Container";
import { Paragraph } from "../../../components/ui/Paragraph";
import { Heading } from "../../../components/ui/Heading";

export const ManageTeachers = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState(null);
  const [togglingTeacher, setTogglingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchAllTeachers,
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
    setEditingTeacher(selectedId);
    handleCloseDropdown();
    setShowEditDialog(true);
  };

  const handleDeleteClick = () => {
    setDeletingTeacher(selectedId);
    handleCloseDropdown();
    setShowDeleteDialog(true);
  };

  const handleToggleClick = () => {
    setTogglingTeacher(selectedId);
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
        <div className="flex items-center gap-1 mb-6 text-sm text-zinc-500">
          <Link className="hover:text-zinc-900 transition-colors" to="/admin">
            Admin
          </Link>
          <LuChevronRight size={14} />
          <span className="text-zinc-900 font-medium">Teachers</span>
        </div>

        <div className="mb-8">
          <Heading className="text-3xl font-bold text-zinc-900 mb-1">
            Teachers
          </Heading>
          <Paragraph>
            Total {data?.data?.length || 0}{" "}
            {data?.data?.length > 1 ? "teachers" : "teacher"} — manage teachers
          </Paragraph>
        </div>

        <div className="float-end">
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowAddDialog(true)}
          >
            <IoAddCircle size={22} />
            Add Teacher
          </Button>
        </div>

        <Table
          data={data?.data}
          columns={columns}
          globalFilterFn={filterSpecificColumns("name", "email")}
          isLoading={isLoading}
        />
      </Container>

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
                Edit
              </Button>
              <Button
                variant="ghost"
                className="text-left text-zinc-900"
                onClick={handleToggleClick}
              >
                Toggle Status
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

      <AnimatePresence>
        {showAddDialog && (
          <AddTeacherDialog close={() => setShowAddDialog(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDialog && editingTeacher && (
          <EditTeacherDialog
            teacher={editingTeacher}
            close={() => {
              setShowEditDialog(false);
              setEditingTeacher(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToggleDialog && togglingTeacher && (
          <ToggleTeacherDialog
            teacher={togglingTeacher}
            close={() => {
              setShowToggleDialog(false);
              setTogglingTeacher(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteDialog && deletingTeacher && (
          <DeleteTeacherDialog
            teacher={deletingTeacher}
            close={() => {
              setShowDeleteDialog(false);
              setDeletingTeacher(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
