import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LuChevronRight } from "react-icons/lu";
import { DateTime } from "luxon";
import { fetchAllStudents } from "../../../api/manageStudents";
import { Table } from "../../../components/Table";
import { StatusBadge } from "../../../components/StatusBadge";

export const ManageStudents = () => {
  const { data } = useQuery({
    queryKey: ["students"],
    queryFn: fetchAllStudents,
  });

  const columns = [
    { header: "SN", cell: (info) => info.row.index + 1 },
    { header: "Name", accessorKey: "name" },
    { header: "Email Address", accessorKey: "email" },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (info) => <StatusBadge active={info.getValue()} />,
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
  ];

  const globalFilterFn = (row, _, filterValue) => {
    const searchableColumns = ["name", "email"];

    return searchableColumns.some((columnId) => {
      const value = row.getValue(columnId);
      if (value == null) return false;

      return String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
    });
  };

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

        <Table
          data={data?.data}
          columns={columns}
          globalFilterFn={globalFilterFn}
        />
      </div>
    </>
  );
};
