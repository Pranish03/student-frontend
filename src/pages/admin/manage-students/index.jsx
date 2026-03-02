import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LuChevronRight, LuEllipsis } from "react-icons/lu";
import { DateTime } from "luxon";
import { fetchAllStudents } from "../../../api/manageStudents";
import { Table } from "../../../components/table/Table";
import { StatusBadge } from "../../../components/StatusBadge";
import { Button } from "../../../components/Button";

export const ManageStudents = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const { data } = useQuery({
    queryKey: ["students"],
    queryFn: fetchAllStudents,
  });

  const handleActionClick = (event, id) => {
    console.log(id);
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 138 + rect.width,
    });

    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  const handleCloseDropdown = () => {
    setSelectedId(null);
  };

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
    {
      header: "Action",
      cell: (info) => (
        <button
          onClick={(e) => handleActionClick(e, info.row.original._id)}
          className="p-1.5 hover:bg-black/5 rounded-[10px] cursor-pointer relative"
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
          <Link className="text-gray-800 hover:underline" to="/admin">
            admin
          </Link>

          <LuChevronRight />

          <span>students</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Students</h2>

        <Table data={data?.data} columns={columns} />
      </div>

      {selectedId && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleCloseDropdown} />
          <div
            className="fixed z-50 flex flex-col bg-white border border-black/20 rounded-[10px] shadow p-1 text-base"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            <Button
              variant="ghost"
              className="text-left text-gray-900"
              onClick={() => handleCloseDropdown()}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              className="text-left text-gray-900"
              onClick={() => handleCloseDropdown()}
            >
              Toggle Status
            </Button>
            <Button
              variant="ghost-danger"
              className="text-left text-gray-900"
              onClick={() => handleCloseDropdown()}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </>
  );
};
