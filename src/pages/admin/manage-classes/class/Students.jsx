import { LuChevronRight, LuEllipsis, LuMail, LuUsers } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import Avatar from "react-avatar";
import { Button } from "../../../../components/Button";
import { IoDuplicate } from "react-icons/io5";
import { useState } from "react";
import { EnrollStudentDialog } from "./EnrollStudentDialog";
import { AnimatePresence } from "framer-motion";
import { Table } from "./Table";

export const Students = ({ classData }) => {
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);

  const columns = [
    {
      header: "Student",
      accessorKey: "name",
      cell: (info) => (
        <div className="flex justify-between">
          <div className="flex items-center gap-6">
            <div>{info.row.index + 1}</div>
            <div className="flex items-center gap-6">
              <Avatar
                name={info.row.original.name}
                value={info.row.original._id}
                size={40}
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
            <button className="p-1.5 bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white rounded-[10px] cursor-pointer">
              <LuTrash2 size={18} />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white border border-zinc-300 rounded-[10px] p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-zinc-900">Students</h2>
          <Button
            className="flex items-center justify-between gap-2"
            onClick={() => setShowEnrollDialog(true)}
          >
            <IoDuplicate />
            Enroll Students
          </Button>
        </div>

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
    </>
  );
};
