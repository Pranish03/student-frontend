/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { LuChevronRight, LuEllipsis } from "react-icons/lu";
import { Button } from "../../../components/Button";
import { fetchAllClasses } from "../../../api/manageClasses";
import { Table } from "../../../components/table/Table";
import { filterSpecificColumns } from "../../../utils/tableFilters";
import { IoAddCircle } from "react-icons/io5";
import { useState } from "react";
import { AddClassDialog } from "./AddClassDialog";
import { motion, AnimatePresence } from "framer-motion";
import { EditClassDialog } from "./EditClassDialog";
import { DeleteClassDialog } from "./DeleteClassDialog";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";

export const ManageClasses = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);
  // const [managingClass, setManagingClass] = useState(null);

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchAllClasses,
  });

  const handleActionClick = (event, classData) => {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 138 + rect.width,
    });

    setSelectedClass((prev) =>
      prev?._id === classData._id ? null : classData,
    );
  };

  const handleCloseDropdown = () => {
    setSelectedClass(null);
  };

  const handleEditClick = () => {
    setEditingClass(selectedClass);
    handleCloseDropdown();
    setShowEditDialog(true);
  };

  const handleDeleteClick = () => {
    setDeletingClass(selectedClass);
    handleCloseDropdown();
    setShowDeleteDialog(true);
  };

  const handleManageClick = () => {
    navigate(`/admin/manage-classes/${selectedClass._id}`);
    // handleCloseDropdown();
  };

  const columns = [
    { header: "SN", cell: (info) => info.row.index + 1 },
    {
      header: "Name",
      accessorKey: "name",
      cell: (info) => (
        <Link
          className="cursor-pointer hover:underline"
          to={`/admin/manage-classes/${info.row.original._id}`}
        >
          {info.getValue()}
        </Link>
      ),
    },
    { header: "Department", accessorKey: "department" },
    { header: "Academic Year", accessorKey: "academicYear" },
    { header: "Capacity", accessorKey: "capacity" },
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
            to="/admin"
          >
            admin
          </Link>

          <LuChevronRight />

          <span className="text-zinc-900">classes</span>
        </div>

        <div className="mb-8">
          <Heading className="mb-1">Classes</Heading>
          <Paragraph>
            Total {data?.data?.length || 0} classes
          </Paragraph>
        </div>

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
          globalFilterFn={filterSpecificColumns("name", "department")}
          isLoading={isLoading}
        />
      </Container>

      <AnimatePresence>
        {selectedClass && (
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
                onClick={handleManageClick}
              >
                Manage Class
              </Button>
              <Button
                variant="ghost"
                className="text-left"
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

      <AnimatePresence>
        {showAddDialog && (
          <AddClassDialog close={() => setShowAddDialog(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDialog && editingClass && (
          <EditClassDialog
            classData={editingClass}
            close={() => setShowEditDialog(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteDialog && deletingClass && (
          <DeleteClassDialog
            classData={deletingClass}
            close={() => setShowDeleteDialog(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
