import { useEffect, useRef, useState } from "react";
import { LuEllipsis } from "react-icons/lu";
import { formatDate } from "../../../utils/formatDate";
import { StatusBadge } from "../../../components/StatusBadge";

export const StudentsTable = ({ students, page, limit }) => {
  const [menu, setMenu] = useState(null);
  const menuRef = useRef(null);

  const openMenu = (e, studentId) => {
    e.stopPropagation();

    if (menu?.id === studentId) {
      setMenu(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    setMenu({
      id: studentId,
      top: rect.bottom + 4,
      left: rect.left,
    });
  };

  const closeMenu = () => setMenu(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div className="rounded-[10px] border border-black/20 overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead className="bg-black/5 text-gray-900">
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

            <tbody className="divide-y divide-black/20 border-t border-black/20 text-gray-800">
              {students?.map((student, index) => (
                <tr key={student._id}>
                  <td className="px-3 py-2">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-3 py-2">{student.name}</td>
                  <td className="px-3 py-2">{student.email}</td>
                  <td className="px-3 py-2">
                    <StatusBadge active={student.isActive} />
                  </td>
                  <td className="px-3 py-2">{formatDate(student.createdAt)}</td>
                  <td className="px-3 py-2">{formatDate(student.updatedAt)}</td>

                  <td className="px-3 py-2">
                    <button
                      onClick={(e) => openMenu(e, student._id)}
                      className="p-1.5 hover:bg-gray-100 rounded-[10px] cursor-pointer"
                    >
                      <LuEllipsis size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {menu && (
        <div
          ref={menuRef}
          style={{ top: menu.top, left: menu.left }}
          className="fixed z-50 flex flex-col bg-white border border-black/20 rounded-[10px] shadow p-1 text-base"
        >
          <button
            onClick={closeMenu}
            className="px-3 py-1.5 hover:bg-black/5 text-left rounded-lg cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={closeMenu}
            className="px-3 py-1.5 hover:bg-black/5 text-left rounded-lg cursor-pointer"
          >
            Deactivate
          </button>
          <button
            onClick={closeMenu}
            className="px-3 py-1.5 hover:bg-red-600/10 text-left rounded-lg cursor-pointer text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
};
