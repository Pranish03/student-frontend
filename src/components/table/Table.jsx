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
  LuSearch,
} from "react-icons/lu";
import { Input } from "../Input";
import { Pagination } from "./Pagination";

export const Table = ({ globalFilterFn, data, columns }) => {
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

  return (
    <div>
      <div className=" flex justify-between mb-4">
        <div className="relative flex items-center">
          <Input
            className="pl-10"
            placeholder="Search"
            value={filtered}
            onChange={(e) => setFiltered(e.target.value)}
          />
          <LuSearch size={18} className="absolute left-3 text-gray-500" />
        </div>
      </div>
      <div className="rounded-[10px] border border-black/20 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-black/5 text-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2.5 font-semibold">
                    <div className="flex items-center gap-4">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {header.column.columnDef.header !== "SN" &&
                        header.column.columnDef.header !== "Action" && (
                          <button
                            className="p-1 border border-black/10 bg-black/1 rounded-[10px] text-gray-800 cursor-pointer hover:bg-white"
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination table={table} />
    </div>
  );
};
