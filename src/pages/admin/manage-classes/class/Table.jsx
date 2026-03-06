/* eslint-disable react-hooks/incompatible-library */
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { LuFilterX, LuInbox, LuSearch, LuX } from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";
import { Input } from "../../../../components/Input";
import { Pagination } from "../../../../components/table/Pagination";

export const Table = ({ data, columns, isLoading = false }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageSize: 6,
    pageIndex: 0,
  });

  const tableData = data || [];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: "includesString",
  });

  const hasData = tableData.length > 0;
  const hasSearchResults = table.getRowModel().rows.length > 0;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="relative flex items-center">
          <Input
            className="px-10"
            placeholder="Search students..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <LuSearch size={18} className="absolute left-3 text-zinc-500" />
          {globalFilter && (
            <button
              className="absolute right-3 cursor-pointer"
              onClick={() => setGlobalFilter("")}
            >
              <LuX size={18} className="text-zinc-500" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <ImSpinner8 size={35} className="animate-spin text-green-600" />
            <p className="mt-2 text-zinc-800 text-lg">Loading...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <LuInbox size={64} className="text-zinc-400" />
            <p className="text-zinc-500 font-bold text-xl">No data</p>
            <p className="text-zinc-500 text-base">
              Check back later or add new items
            </p>
          </div>
        ) : !hasSearchResults ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <LuFilterX size={64} className="text-zinc-400" />
            <p className="text-zinc-500 font-bold text-xl">No result found</p>
            <p className="text-zinc-500 text-base mb-3">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <table className="min-w-full">
            <tbody className="text-zinc-800">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination table={table} />
    </div>
  );
};
