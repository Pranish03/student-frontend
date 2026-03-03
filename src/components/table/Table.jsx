/* eslint-disable react-hooks/incompatible-library */
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  LuChevronDown,
  LuChevronsUpDown,
  LuChevronUp,
  LuFilterX,
  LuInbox,
  LuSearch,
  LuX,
} from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";
import { Input } from "../Input";
import { Pagination } from "./Pagination";
import { Button } from "../Button";

export const Table = ({ globalFilterFn, data, columns, isLoading = false }) => {
  const [sorted, setSorted] = useState();
  const [filtered, setFiltered] = useState();

  const tableData = data || [];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorted,
      globalFilter: filtered,
    },
    onSortingChange: setSorted,
    onGlobalFilterChange: setFiltered,
    globalFilterFn,
  });

  const hasData = tableData.length > 0;
  const hasSearchResults = table.getRowModel().rows.length > 0;

  return (
    <div>
      <div className=" flex justify-between mb-4">
        <div className="relative flex items-center">
          <Input
            className="px-10"
            placeholder="Search"
            value={filtered}
            onChange={(e) => setFiltered(e.target.value)}
          />
          <LuSearch size={18} className="absolute left-3 text-gray-500" />
          {filtered && (
            <button
              className="absolute right-3 cursor-pointer"
              onClick={() => setFiltered("")}
            >
              <LuX size={18} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>
      <div className="rounded-[10px] border border-black/20 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <ImSpinner8 size={35} className="animate-spin text-green-600" />

            <p className="mt-2 text-gray-800 text-lg">Loading...</p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <LuInbox size={64} className="text-zinc-400" />
            <p className="text-gray-900 font-bold text-xl">No data</p>
            <p className="text-gray-800 text-base">
              Check back later or add new items
            </p>
          </div>
        ) : !hasSearchResults ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <LuFilterX size={64} className="text-zinc-400" />
            <p className="text-gray-900 font-bold text-xl">No result found</p>
            <p className="text-gray-800 text-base mb-3">
              Try adjusting your search terms
            </p>
            {filtered && (
              <Button variant="secondary" onClick={() => setFiltered("")}>
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-black/5 text-gray-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-3 py-2.5 font-semibold">
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        {header.column.columnDef.header !== "SN" &&
                          header.column.columnDef.header !== "Action" && (
                            <button
                              className="p-1 bg-black/1 rounded-[10px] text-gray-800 cursor-pointer hover:bg-white"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {{
                                asc: <LuChevronDown />,
                                desc: <LuChevronUp />,
                              }[header.column.getIsSorted()] || (
                                <LuChevronsUpDown />
                              )}
                            </button>
                          )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-black/20 border-t border-black/20 text-gray-800">
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
