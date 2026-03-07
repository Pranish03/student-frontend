import { MdOutlineAssignment } from "react-icons/md";
import { Button } from "../../../../components/Button";
import { Table } from "./Table";
import { useState } from "react";
import { AssignCourseDialog } from "./AssignCourseDialog";
import { LuTrash2 } from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { RemoveCourseDialog } from "./RemoveCourseDialog";

export const Courses = ({ classData }) => {
  const [courseId, setCourseId] = useState(null);

  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const handleRemove = (id) => {
    setCourseId(id);
    setShowRemoveDialog(true);
  };

  const columns = [
    {
      header: "Courses",
      accessorKey: "name",
      cell: (info) => (
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div>{info.row.index + 1}.</div>
            <div className="flex items-center gap-2">
              <p className="flex items-center text-sm font-medium gap-1 text-white bg-green-600 w-fit py-0.5 px-2.5 rounded-full">
                <BsFileEarmarkCodeFill size={16} />
                {info.row.original.code}
              </p>
              <p className="font-medium text-zinc-900">
                {info.row.original.name}
              </p>
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

  return (
    <>
      <div className="border border-zinc-300 rounded-[10px] p-6">
        <h2 className="text-2xl font-semibold text-zinc-900 mb-3">Courses</h2>

        <Button
          className="float-end flex items-center gap-2"
          onClick={() => setShowAssignDialog(true)}
        >
          <MdOutlineAssignment size={20} />
          Assign Courses
        </Button>

        <Table data={classData?.courses} columns={columns} />
      </div>

      {showAssignDialog && (
        <AssignCourseDialog
          classData={classData}
          close={() => setShowAssignDialog(false)}
        />
      )}

      {showRemoveDialog && (
        <RemoveCourseDialog
          classId={classData?._id}
          courseId={courseId}
          close={() => setShowRemoveDialog(false)}
        />
      )}
    </>
  );
};
