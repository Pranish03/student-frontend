import {
  LuClock,
  LuTrash2,
  LuLoader,
  LuPencil,
  LuCoffee,
} from "react-icons/lu";
import { daysOfWeek } from "../../../../schemas/scheduleSchema";
import { Button } from "../../../../components/Button";

export const ScheduleGrid = ({
  scheduleData,
  ScheduleLoading,
  scheduleError,
  onEditEntry,
  onDeleteEntry,
  onAddSchedule,
}) => {
  if (ScheduleLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LuLoader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (scheduleError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-[10px] p-6 text-center">
        <p className="text-red-600">
          Error loading schedule. Please try again.
        </p>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="text-center py-12 bg-zinc-50 rounded-[10px]">
        <LuClock className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          No Schedule Created
        </h3>
        <p className="text-zinc-600 mb-6">
          This class doesn't have a schedule yet.
        </p>
        <Button onClick={onAddSchedule} className="mx-auto">
          Create Schedule
        </Button>
      </div>
    );
  }

  const timeSlots = [
    "06:30 - 08:00",
    "08:00 - 08:30",
    "08:30 - 10:00",
    "10:00 - 11:30",
  ];

  const breakSlots = ["08:00 - 08:30"];

  const breakLabels = {
    "08:00 - 08:30": "Morning Break",
  };

  const breakIcons = {
    "08:00 - 08:30": <LuCoffee className="w-4 h-4" />,
  };

  const scheduleMatrix = daysOfWeek.reduce((acc, day) => {
    acc[day] = timeSlots.reduce((timeAcc, timeSlot) => {
      if (breakSlots.includes(timeSlot)) {
        timeAcc[timeSlot] = "break";
        return timeAcc;
      }

      const entry = scheduleData?.timeTable?.find(
        (e) => e.day === day && `${e.startTime} - ${e.endTime}` === timeSlot,
      );
      timeAcc[timeSlot] = entry || null;
      return timeAcc;
    }, {});
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto border border-zinc-200 rounded-[10px]">
      <table className="w-full min-w-200 border-collapse">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 w-40">
              Day / Time
            </th>
            {timeSlots.map((timeSlot) => (
              <th
                key={timeSlot}
                className={`px-6 py-4 text-left text-sm font-semibold border-l border-zinc-200 min-w-50 ${
                  breakSlots.includes(timeSlot)
                    ? "bg-amber-50/50 text-amber-700"
                    : "text-zinc-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  {breakIcons[timeSlot] && (
                    <span className="text-amber-500">
                      {breakIcons[timeSlot]}
                    </span>
                  )}
                  <span>{timeSlot}</span>
                  {breakLabels[timeSlot] && (
                    <span className="text-xs font-normal text-amber-600 ml-1">
                      ({breakLabels[timeSlot]})
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {daysOfWeek.map((day) => (
            <tr key={day} className="hover:bg-zinc-50/50">
              <td className="px-6 py-4 text-sm font-medium text-zinc-900 bg-zinc-50/50">
                {day}
              </td>
              {timeSlots.map((timeSlot) => {
                const entry = scheduleMatrix[day][timeSlot];

                if (entry === "break") {
                  return (
                    <td
                      key={`${day}-${timeSlot}`}
                      className="px-6 py-4 border-l border-zinc-200 bg-amber-50/30"
                    >
                      <div className="h-18 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-amber-600">
                            {breakIcons[timeSlot]}
                            <span className="text-xs font-medium">
                              {breakLabels[timeSlot] || "Break"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                }

                return (
                  <td
                    key={`${day}-${timeSlot}`}
                    className="px-6 py-4 border-l border-zinc-200"
                  >
                    {entry ? (
                      <div className="group relative">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="font-medium text-zinc-900 text-sm mb-1">
                            {entry.course?.name || "Course"}
                          </p>
                          <p className="text-xs text-zinc-600 mb-1">
                            Room: {entry.room}
                          </p>
                          {entry.teacher && (
                            <p className="text-xs text-zinc-500">
                              {entry.teacher.name || entry.teacher}
                            </p>
                          )}

                          {/* Action buttons - appear on hover */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEditEntry(entry)}
                              className="p-1.5 bg-white border border-zinc-200 text-zinc-600 hover:text-green-600 hover:border-green-200 hover:bg-green-50 rounded-lg shadow-sm transition-all"
                              title="Edit entry"
                            >
                              <LuPencil size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteEntry(entry)}
                              className="p-1.5 bg-white border border-zinc-200 text-zinc-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg shadow-sm transition-all"
                              title="Delete entry"
                            >
                              <LuTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-18 bg-zinc-50/30 rounded-lg border border-dashed border-zinc-200 flex items-center justify-center">
                        <span className="text-xs text-zinc-400">—</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {(!scheduleData.timeTable || scheduleData.timeTable.length === 0) && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No timetable entries yet</p>
          <p className="text-sm text-zinc-400 mt-1">
            Click "Add Entry" to create your first schedule entry
          </p>
        </div>
      )}
    </div>
  );
};
