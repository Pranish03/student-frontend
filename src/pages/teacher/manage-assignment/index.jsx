/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { DateTime } from "luxon";
import { LuChevronRight, LuEllipsis } from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { Button } from "../../../components/Button";
import { Table } from "../../../components/table/Table";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import { EditAssignmentDialog } from "./EditAssignmentDialog";
import { DeleteAssignmentDialog } from "./DeleteAssignmentDialog";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";


export const ManageAssignment = () => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deletingAssignment, setDeletingAssignment] = useState(null);

  const data = {
  data: [
    {
      _id: "1",
      title: "React Assignment",
      file: "/react-assignment.pdf",
      deadline: "2026-03-25",
      createdAt: "2026-03-10T10:00:00Z",
      updatedAt: "2026-03-11T10:00:00Z",
    },
    {
      _id: "2",
      title: "OS Assignment",
      file: "/os-assignment.pdf",
      deadline: "2026-03-30",
      createdAt: "2026-02-10T10:00:00Z",
      updatedAt: "2026-02-11T10:00:00Z",
    },
  ],
};

  const isLoading = false;

  const handleActionClick = (event, assignment) => {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    setSelectedAssignment((prev) =>
      prev === assignment ? null : assignment
    );
  };

  const handleCloseDropdown = () => setSelectedAssignment(null);

  const handleEditClick = () => {
    setEditingAssignment(selectedAssignment);
    handleCloseDropdown();
    setShowEditDialog(true);
  };

  const handleDeleteClick = () => {
    setDeletingAssignment(selectedAssignment);
    handleCloseDropdown();
    setShowDeleteDialog(true);
  };

  const columns = [
    {
      header: "SN",
      cell: (info) => info.row.index + 1,
    },

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
  header: "Deadline",
  accessorKey: "deadline",
  cell: (info) => DateTime.fromISO(info.getValue()).toFormat("dd LLL yyyy"),
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
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <Link
            className="text-zinc-500 hover:underline hover:text-zinc-900"
            to="/teacher"
          >
            Teacher
          </Link>

          <LuChevronRight />

          <span className="text-zinc-900">Assignments</span>
        </div>

        <div className="mb-8">
          <Heading className="mb-1">
            Assignments
          </Heading>

          <Paragraph>
            {data?.data?.length || 0} total assignments
          </Paragraph>
        </div>

        <div className="float-end">
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowAddDialog(true)}
          >
            <IoAddCircle size={22} />
            Add New Assignment
          </Button>
        </div>

        <Table data={data?.data} columns={columns} isLoading={isLoading} />
      </Container>

      <AnimatePresence>
        {selectedAssignment && (
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
          <AddAssignmentDialog close={() => setShowAddDialog(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDialog && editingAssignment && (
          <EditAssignmentDialog
            assignment={editingAssignment}
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