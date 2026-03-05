import { Link } from "react-router-dom";
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
import { AnimatePresence } from "framer-motion";

export const ManageClasses = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchAllClasses,
  });

  const columns = [
    { header: "SN", cell: (info) => info.row.index + 1 },
    { header: "Name", accessorKey: "name" },
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
          // onClick={(e) => handleActionClick(e, info.row.original)}
          className="p-1.5 hover:bg-zinc-100 rounded-[10px] cursor-pointer relative"
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
          <h1 className="text-3xl font-bold text-zinc-900 mb-1">Classes</h1>
          <p className="text-zinc-800">Total 0 classes</p>
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
      </div>

      <AnimatePresence>
        {showAddDialog && (
          <AddClassDialog close={() => setShowAddDialog(false)} />
        )}
      </AnimatePresence>
    </>
  );
};
