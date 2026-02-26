import {
  LuEllipsis,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";
import { IoCheckmarkCircle, IoCloseCircleSharp } from "react-icons/io5";
import { useFetch } from "../../../hooks/useFetch";
import { formatDate } from "../../../utils/formatDate";
import { useState } from "react";
import { Button } from "../../../components/Button";

export const ManageStudents = () => {
  const [page, setPage] = useState(1);

  const { data } = useFetch(`/users?role=student&page=${page}&limit=1`);

  const pagination = data?.pagination;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Students</h2>

      <div className="mx-auto">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">SN</th>
                <th className="px-3 py-2 text-left font-semibold">Name</th>
                <th className="px-3 py-2 text-left font-semibold">Email</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">
                  Created at
                </th>
                <th className="px-3 py-2 text-left font-semibold">
                  Updated at
                </th>
                <th className="px-3 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data?.data?.map((student, index) => (
                <tr key={student._id}>
                  <td className="px-3 py-2">{++index}</td>
                  <td className="px-3 py-2">{student.name}</td>
                  <td className="px-3 py-2">{student.email}</td>
                  <td className="px-3 py-2">
                    {student.isActive ? (
                      <span className="py-0.5 px-2 rounded-full border border-gray-200 text-gray-500 text-sm flex items-center gap-1 max-w-min">
                        <IoCheckmarkCircle
                          size={14}
                          className="text-green-500"
                        />
                        Active
                      </span>
                    ) : (
                      <span className="py-0.5 px-2 rounded-full border border-gray-200 text-gray-500 text-sm flex items-center gap-1 max-w-min">
                        <IoCloseCircleSharp
                          size={14}
                          className="text-red-600"
                        />
                        Deactive
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{formatDate(student.createdAt)}</td>
                  <td className="px-3 py-2">{formatDate(student.updatedAt)}</td>

                  <td className="px-3 py-2">
                    <button className="p-1.5 hover:bg-gray-100 cursor-pointer rounded-lg">
                      <LuEllipsis size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination?.totalPages > 1 && (
          <div className="flex items-center justify-end gap-6 mt-5">
            <p className="text-gray-800">
              Page {pagination?.page} of {pagination?.totalPages}
            </p>

            <div className="flex items-center gap-1.5">
              <button
                className="p-1 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-800"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                <LuChevronsLeft size={19} />
              </button>

              <button
                className="p-1 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-800"
                disabled={page === 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                }}
              >
                <LuChevronLeft size={19} />
              </button>

              <button
                className="p-1 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-800"
                disabled={page === pagination?.totalPages}
                onClick={() => {
                  setPage((p) => Math.min(pagination?.totalPages, p + 1));
                }}
              >
                <LuChevronRight size={19} />
              </button>

              <button
                className="p-1 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-gray-800"
                disabled={page === pagination?.totalPages}
                onClick={() => setPage(pagination?.totalPages)}
              >
                <LuChevronsRight size={19} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
