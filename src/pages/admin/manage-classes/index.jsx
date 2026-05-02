/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LuChevronRight,
  LuEllipsis,
  LuUsers,
  LuBookOpen,
  LuBuilding,
  LuSearch,
  LuX,
  LuFilterX,
} from "react-icons/lu";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { fetchAllClasses } from "../../../api/manageClasses";
import { IoAddCircle } from "react-icons/io5";
import { useState } from "react";
import { AddClassDialog } from "./AddClassDialog";
import { motion, AnimatePresence } from "framer-motion";
import { EditClassDialog } from "./EditClassDialog";
import { DeleteClassDialog } from "./DeleteClassDialog";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";
import { ImSpinner8 } from "react-icons/im";

const InfoRow = ({ label, value }) => (
  <p className="text-sm text-zinc-500">
    <span className="font-medium text-zinc-700">{label}: </span>
    {value ?? <i className="text-zinc-400">Not set</i>}
  </p>
);

const ClassCard = ({ classData, onManage, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const studentCount = classData.students?.length ?? 0;
  const courseCount = classData.courses?.length ?? 0;
  const capacity = classData.capacity ?? 35;
  const fillPct = Math.min((studentCount / capacity) * 100, 100);
  const barColor =
    fillPct > 85
      ? "bg-red-500"
      : fillPct > 60
        ? "bg-yellow-500"
        : "bg-green-600";

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 138 + rect.width,
    });
    setShowDropdown(true);
  };

  const closeDropdown = () => setShowDropdown(false);

  return (
    <>
      <div className="bg-white rounded-[10px] overflow-hidden border border-zinc-300 flex flex-col">
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-4">
            <Link
              to={`/admin/manage-classes/${classData._id}`}
              className="text-xl font-semibold text-zinc-800 leading-tight pr-2 hover:underline hover:text-green-600 transition-colors"
            >
              {classData.name}
            </Link>
            <button
              onClick={handleDropdownClick}
              className="p-1.5 hover:bg-zinc-100 rounded-[10px] cursor-pointer text-zinc-500 shrink-0"
            >
              <LuEllipsis size={18} />
            </button>
          </div>

          <div className="space-y-2 mb-4 flex-1">
            <InfoRow label="Department" value={classData.department} />
            <InfoRow label="Academic Year" value={classData.academicYear} />
            <InfoRow label="Capacity" value={capacity} />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
              <span>Enrollment</span>
              <span>
                {studentCount} / {capacity}
              </span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-zinc-500">
              <LuUsers size={14} className="text-blue-500" />
              <span>
                {studentCount} student{studentCount !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-zinc-300">·</span>
            <div className="flex items-center gap-1.5 text-sm text-zinc-500">
              <LuBookOpen size={14} className="text-green-500" />
              <span>
                {courseCount} course{courseCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <Link to={`/admin/manage-classes/${classData._id}`}>
            <Button className="w-full">Manage Class</Button>
          </Link>
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
                  onManage(classData);
                }}
              >
                Manage Class
              </Button>
              <Button
                variant="ghost"
                className="text-left text-zinc-900"
                onClick={() => {
                  closeDropdown();
                  onEdit(classData);
                }}
              >
                Edit
              </Button>
              <Button
                variant="ghost-danger"
                className="text-left"
                onClick={() => {
                  closeDropdown();
                  onDelete(classData);
                }}
              >
                Delete
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const ManageClasses = () => {
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchAllClasses,
  });

  const classes = data?.data ?? [];

  const filteredClasses = classes.filter((cls) => {
    const q = search.toLowerCase();
    return (
      cls.name?.toLowerCase().includes(q) ||
      cls.department?.toLowerCase().includes(q) ||
      String(cls.academicYear).includes(q)
    );
  });

  const handleManage = (classData) => {
    navigate(`/admin/manage-classes/${classData._id}`);
  };

  const handleEdit = (classData) => {
    setEditingClass(classData);
    setShowEditDialog(true);
  };

  const handleDelete = (classData) => {
    setDeletingClass(classData);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <Container>
        <div className="flex items-center gap-1 mb-6 text-sm text-zinc-500">
          <Link className="hover:text-zinc-900 transition-colors" to="/admin">
            Admin
          </Link>
          <LuChevronRight size={14} />
          <span className="text-zinc-900 font-medium">Classes</span>
        </div>

        <div className="mb-8">
          <Heading className="text-3xl font-bold text-zinc-900 mb-1">
            Classes
          </Heading>
          <Paragraph>
            {isLoading
              ? "Loading..."
              : `${classes.length} ${classes.length !== 1 ? "classes" : "class"} — manage classes`}
          </Paragraph>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex items-center">
            <Input
              className="px-10 w-80"
              placeholder="Search by name, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <LuSearch size={18} className="absolute left-3 text-zinc-500" />
            {search && (
              <button
                className="absolute right-3 cursor-pointer"
                onClick={() => setSearch("")}
              >
                <LuX size={18} className="text-zinc-500" />
              </button>
            )}
          </div>

          <Button
            className="flex items-center gap-2 shrink-0"
            onClick={() => setShowAddDialog(true)}
          >
            <IoAddCircle size={22} />
            Add Class
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <ImSpinner8 size={32} className="animate-spin text-green-600" />
            <p className="mt-3 text-zinc-500 text-sm">Loading classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <LuBuilding size={56} className="text-zinc-300 mb-3" />
            <p className="text-zinc-500 font-semibold text-lg">
              No classes yet
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              Click 'Add Class' to create your first class
            </p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <LuFilterX size={56} className="text-zinc-300 mb-3" />
            <p className="text-zinc-500 font-semibold text-lg">
              No results found
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <ClassCard
                key={cls._id}
                classData={cls}
                onManage={handleManage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </Container>

      <AnimatePresence>
        {showAddDialog && (
          <AddClassDialog close={() => setShowAddDialog(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDialog && editingClass && (
          <EditClassDialog
            classData={editingClass}
            close={() => {
              setShowEditDialog(false);
              setEditingClass(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteDialog && deletingClass && (
          <DeleteClassDialog
            classData={deletingClass}
            close={() => {
              setShowDeleteDialog(false);
              setDeletingClass(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
