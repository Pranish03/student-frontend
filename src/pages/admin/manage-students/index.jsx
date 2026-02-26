import { useState } from "react";
import { LuEllipsis } from "react-icons/lu";
import { IoCheckmarkCircle, IoCloseCircleSharp } from "react-icons/io5";
import { useFetch } from "../../../hooks/useFetch";
import { formatDate } from "../../../utils/formatDate";
import { Pagination } from "../../../components/Pagination";

export const ManageStudents = () => {
  const [page, setPage] = useState(1);

  const { data } = useFetch(`/users?role=student&page=${page}&limit=1`);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Students</h2>

      <div className="mx-auto">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b border-gray-200 text-gray-900">
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

            <tbody className="divide-y divide-gray-200 text-gray-800">
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

        <Pagination
          page={page}
          totalPages={data?.pagination?.totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
