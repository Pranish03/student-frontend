import { StatusBadge } from "../../../../components/StatusBadge";
import { LuInbox } from "react-icons/lu";

export const Table = ({
  canEdit,
  isEditing,
  presentCount,
  totalStudents,
  handleSelectAll,
  attendanceData,
  handleAttendanceChange,
}) => {
  if (!attendanceData || attendanceData.length === 0) {
    return (
      <div className="rounded-[10px] border border-zinc-300 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <LuInbox size={64} className="text-zinc-400" />
          <p className="text-zinc-500 font-bold text-xl">No students found</p>
          <p className="text-zinc-500 text-base">
            No students are enrolled in this class
          </p>
        </div>
      </div>
    );
  }

  const allSelected = presentCount === totalStudents && totalStudents > 0;

  return (
    <div className="rounded-[10px] border border-zinc-300 overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-zinc-100 text-zinc-900">
          <tr>
            <th className="px-3 py-2.5 font-semibold text-left w-16">
              {canEdit && isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded accent-green-600 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-zinc-700">All</span>
                </div>
              ) : (
                <span>Status</span>
              )}
            </th>
            <th className="px-3 py-2.5 font-semibold text-left w-16">SN</th>
            <th className="px-3 py-2.5 font-semibold text-left">
              Student Name
            </th>
            <th className="px-3 py-2.5 font-semibold text-left">Email</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-300 border-t border-zinc-300 text-zinc-800">
          {attendanceData.map((record, index) => (
            <tr
              key={record.student || index}
              className={`transition-colors ${
                canEdit && isEditing ? "hover:bg-zinc-50 cursor-pointer" : ""
              } ${
                canEdit && isEditing && record.isPresent ? "bg-green-50/50" : ""
              }`}
              onClick={() => {
                if (canEdit && isEditing) {
                  handleAttendanceChange(record.student, !record.isPresent);
                }
              }}
            >
              <td className="px-3 py-2.5">
                {canEdit && isEditing ? (
                  <input
                    type="checkbox"
                    checked={record.isPresent}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleAttendanceChange(record.student, e.target.checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded accent-green-600 cursor-pointer"
                  />
                ) : (
                  <StatusBadge
                    active={record.isPresent}
                    right="Present"
                    wrong="Absent"
                  />
                )}
              </td>
              <td className="px-3 py-2.5 text-zinc-500">{index + 1}</td>
              <td className="px-3 py-2.5 font-medium text-zinc-900">
                {record.studentName}
              </td>
              <td className="px-3 py-2.5 text-zinc-600">
                {record.studentEmail}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
