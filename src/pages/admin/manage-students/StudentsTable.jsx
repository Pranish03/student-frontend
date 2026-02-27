import { useEffect, useRef, useState } from "react";
import { TableRow } from "./TableRow";
import { ActionMenu } from "./ActionMenu";

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
      right: window.innerWidth - rect.right,
    });
  };

  const closeMenu = () => setMenu(null);

  useEffect(() => {
    if (!menu) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menu]);

  const tableHeading = [
    "SN",
    "Name",
    "Email",
    "Status",
    "Created at",
    "Updated at",
    "Actions",
  ];

  return (
    <>
      <div className="rounded-[10px] border border-black/20 overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-full">
            <thead className="bg-black/5 text-gray-900">
              <tr>
                {tableHeading.map((heading, index) => (
                  <th key={index} className="px-3 py-2 text-left font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-black/20 border-t border-black/20 text-gray-800">
              {students?.map((student, index) => (
                <TableRow
                  key={student._id}
                  student={student}
                  index={index}
                  page={page}
                  limit={limit}
                  onMenuOpen={openMenu}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ActionMenu menu={menu} menuRef={menuRef} onClose={() => setMenu(null)} />
    </>
  );
};
