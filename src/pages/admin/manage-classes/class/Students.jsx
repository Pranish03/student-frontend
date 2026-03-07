import { LuMail } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import Avatar from "react-avatar";
import { Button } from "../../../../components/Button";
import { IoDuplicate } from "react-icons/io5";
import { useState } from "react";
import { EnrollStudentDialog } from "./EnrollStudentDialog";
import { RemoveStudentDialog } from "./RemoveStudentDialog";
import { AnimatePresence } from "framer-motion";
import { Table } from "./Table";

export const Students = ({ classData }) => {
  const [studentId, setStudentId] = useState(null);

  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const columns = [
    {
      header: "Student",
      accessorKey: "name",
      cell: (info) => (
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div>{info.row.index + 1}.</div>
            <div className="flex items-center gap-4">
              <Avatar
                name={info.row.original.name}
                value={info.row.original._id}
                size={45}
                round
              />
              <div>
                <p className="font-medium text-zinc-900">
                  {info.row.original.name}
                </p>
                <div className="flex items-center gap-1 text-sm text-zinc-500">
                  <LuMail />
                  <span>{info.row.original.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              className="p-1.5 bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white rounded-[10px] cursor-pointer"
              onClick={() => handleRemove(info.row.original._id)}
            >
              <LuTrash2 size={18} />
            </button>
          </div>
        </div>
      ),
    },
  ];

  const handleRemove = (id) => {
    setStudentId(id);
    setShowRemoveDialog(true);
  };

  return (
    <>
      <div className="bg-white border border-zinc-300 rounded-[10px] p-6">
        <h2 className="text-2xl font-semibold text-zinc-900 mb-3">Students</h2>

        <Button
          className="flex items-center justify-between gap-2 float-end"
          onClick={() => setShowEnrollDialog(true)}
        >
          <IoDuplicate />
          Enroll Students
        </Button>

        <Table data={classData?.students} columns={columns} />
      </div>

      <AnimatePresence>
        {showEnrollDialog && (
          <EnrollStudentDialog
            classData={classData}
            close={() => setShowEnrollDialog(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRemoveDialog && studentId && (
          <RemoveStudentDialog
            classId={classData?._id}
            studentId={studentId}
            close={() => setShowRemoveDialog(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
