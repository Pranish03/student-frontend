import { StatusBadge } from "../../../../components/StatusBadge";

export const Table = ({
  canEdit,
  isEditing,
  presentCount,
  totalStudents,
  handleSelectAll,
  attendanceData,
  handleAttendanceChange,
}) => {
  return (
    <div className="rounded-[10px] border border-zinc-300 overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-zinc-100 text-zinc-900">
          <tr className="text-left">
            <th className="pl-20 pr-3 py-2.5 font-semibold">
              {canEdit && isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      presentCount === totalStudents && totalStudents > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded-[10px] accent-green-600"
                  />
                  <span>Select All</span>
                </div>
              ) : (
                <span>Status</span>
              )}
            </th>
            <th className="px-3 py-2.5 font-semibold">Roll No</th>
            <th className="px-3 py-2.5 font-semibold">Student Name</th>
            <th className="px-3 py-2.5 font-semibold">Email</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-300 border-t border-zinc-300 text-zinc-800">
          {attendanceData.map((record, i) => (
            <tr key={record.student} className="text-left">
              <td className="pl-20 pr-3 py-2.5">
                {canEdit && isEditing ? (
                  <input
                    type="checkbox"
                    checked={record.isPresent}
                    onChange={(e) =>
                      handleAttendanceChange(record.student, e.target.checked)
                    }
                    className="w-4 h-4 rounded-[10px] accent-green-600"
                  />
                ) : (
                  <StatusBadge
                    active={record.isPresent}
                    right="Present"
                    wrong="Absent"
                  />
                )}
              </td>
              <td className="px-3 py-2.5">{++i}</td>
              <td className="px-3 py-2.5">{record.studentName}</td>
              <td className="px-3 py-2.5">{record.studentEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
