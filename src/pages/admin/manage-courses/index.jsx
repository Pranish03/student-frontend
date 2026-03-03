/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { LuChevronRight, LuEllipsis } from "react-icons/lu";
import { Button } from "../../../components/Button";
import { IoAddCircle } from "react-icons/io5";
import { fetchAllCourses } from "../../../api/manageCourses";
import { Table } from "../../../components/table/Table";
import { AddCourseDialog } from "./AddCourseDialog";
import { EditCourseDialog } from "./EditCourseDialog";
import { filterSpecificColumns } from "../../../utils/tableFilters";
import { DeleteCourseDialog } from "./DeleteCourseDialog";
import { AssignTeacherDialog } from "./AssignTeacherDialog";

export const ManageCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [assigningCourse, setAssigningCourse] = useState(null);

  const { data } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchAllCourses,
  });

  const handleActionClick = (event, course) => {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 138 + rect.width,
    });

    setSelectedCourse((prev) => (prev?._id === course._id ? null : course));
  };

  const handleCloseDropdown = () => {
    setSelectedCourse(null);
  };

  const handleEditClick = () => {
    setEditingCourse(selectedCourse);
    handleCloseDropdown();
    setShowEditDialog(true);
  };

  const handleDeleteClick = () => {
    setDeletingCourse(selectedCourse);
    handleCloseDropdown();
    setShowDeleteDialog(true);
  };

  const handleAssignClick = () => {
    setAssigningCourse(selectedCourse);
    handleCloseDropdown();
    setShowAssignDialog(true);
  };

  const columns = [
    { header: "SN", cell: (info) => info.row.index + 1 },
    { header: "Name", accessorKey: "name" },
    { header: "Code", accessorKey: "code" },
    {
      header: "Teacher",
      accessorKey: "teacher",
      cell: (info) => {
        const teacher = info.getValue();
        return teacher ? teacher.name || teacher.email : <i>Not assigned</i>;
      },
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

          <span>courses</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Courses</h2>

        <div className="float-end">
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowAddDialog(true)}
          >
            <IoAddCircle size={22} />
            Add Course
          </Button>
        </div>

        <Table
          data={data?.data}
          columns={columns}
          globalFilterFn={filterSpecificColumns("name", "code")}
        />
      </div>

      <AnimatePresence>
        {selectedCourse && (
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
                onClick={handleAssignClick}
              >
                {!selectedCourse.teacher ? "Assign Teacher" : "Change Teacher"}
              </Button>
              {selectedCourse.teacher && (
                <Button
                  variant="ghost-danger"
                  className="text-left text-gray-900"
                  onClick={handleCloseDropdown}
                >
                  Delete Teacher
                </Button>
              )}
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
          <AddCourseDialog close={() => setShowAddDialog(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDialog && editingCourse && (
          <EditCourseDialog
            course={editingCourse}
            close={() => setShowEditDialog(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteDialog && deletingCourse && (
          <DeleteCourseDialog
            course={deletingCourse}
            close={() => setShowDeleteDialog(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAssignDialog && assigningCourse && (
          <AssignTeacherDialog
            course={assigningCourse}
            close={() => setShowAssignDialog(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
