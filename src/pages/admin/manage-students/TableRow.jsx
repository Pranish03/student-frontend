import { LuEllipsis } from "react-icons/lu";
import { StatusBadge } from "../../../components/StatusBadge";
import { formatDate } from "../../../utils/formatDate";

export const TableRow = ({ student, index, page, limit, onMenuOpen }) => {
  return (
    <tr key={student._id}>
      <td className="px-3 py-2">{(page - 1) * limit + index + 1}</td>
      <td className="px-3 py-2">{student.name}</td>
      <td className="px-3 py-2">{student.email}</td>
      <td className="px-3 py-2">
        <StatusBadge active={student.isActive} />
      </td>
      <td className="px-3 py-2">{formatDate(student.createdAt)}</td>
      <td className="px-3 py-2">{formatDate(student.updatedAt)}</td>

      <td className="px-3 py-2">
        <button
          onClick={(e) => onMenuOpen(e, student._id)}
          className="p-1.5 hover:bg-gray-100 rounded-[10px] cursor-pointer"
        >
          <LuEllipsis size={18} />
        </button>
      </td>
    </tr>
  );
};
