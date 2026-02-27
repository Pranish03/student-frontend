import { useState } from "react";
import { Link } from "react-router-dom";
import { IoAddCircle } from "react-icons/io5";
import { LuChevronRight, LuSearch } from "react-icons/lu";
import { useFetch } from "../../../hooks/useFetch";
import { StudentsTable } from "./StudentsTable";
import { AddStudentDialog } from "./AddStudentDialog";
import { Pagination } from "../../../components/Pagination";
import { Button } from "../../../components/Button";
import { AnimatePresence } from "framer-motion";
import { Input } from "../../../components/Input";

export const ManageStudents = () => {
  const [page, setPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const limit = 14;

  const { data, reFetch } = useFetch(`/users?page=${page}&limit=${limit}`);

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

        <div className=" flex justify-between mb-4">
          <div className="relative flex items-center">
            <Input className="pl-10" placeholder="Search" />
            <LuSearch size={18} className="absolute left-3 text-gray-500" />
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowAddDialog(true)}
          >
            <IoAddCircle size={22} />
            Add Student
          </Button>
        </div>

        <StudentsTable students={data?.data} page={page} limit={limit} />

        <Pagination
          page={page}
          totalPages={data?.pagination?.totalPages}
          onPageChange={setPage}
        />
      </div>

      <AnimatePresence>
        {showAddDialog && (
          <AddStudentDialog
            close={() => setShowAddDialog(false)}
            onSuccess={reFetch}
          />
        )}
      </AnimatePresence>
    </>
  );
};
