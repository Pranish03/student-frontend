import { useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { useFetch } from "../../../hooks/useFetch";
import { StudentsTable } from "./StudentsTable";
import { AddStudentDialog } from "./AddStudentDialog";
import { Pagination } from "../../../components/Pagination";
import { Button } from "../../../components/Button";

export const ManageStudents = () => {
  const [page, setPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const limit = 10;

  const { data, reFetch } = useFetch(`/users?page=${page}&limit=${limit}`);

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Students</h2>

        <div className=" flex justify-end mb-4">
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

      {showAddDialog && (
        <AddStudentDialog
          close={() => setShowAddDialog(false)}
          onSuccess={reFetch}
        />
      )}
    </>
  );
};
