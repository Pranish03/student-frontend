import { LuClock, LuTrash2, LuLoader, LuPencil } from "react-icons/lu";
import { daysOfWeek } from "../../../../schemas/scheduleSchema";
import { Button } from "../../../../components/Button";

export const ScheduleTable = ({
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
    "08:00 - 08:30": "Break Time",
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

  const daysWithEntries = daysOfWeek.filter((day) => {
    return timeSlots.some((timeSlot) => {
      const entry = scheduleMatrix[day][timeSlot];
      return entry !== null && entry !== "break";
    });
  });

  if (daysWithEntries.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-50 rounded-[10px]">
        <LuClock className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          No Schedule Entries
        </h3>
        <p className="text-zinc-600 mb-6">
          This class doesn't have any schedule entries yet.
        </p>
        <Button onClick={onAddSchedule} className="mx-auto">
          Add Entry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <table className="w-full min-w-200 mt-8">
        <thead>
          <tr>
            <th />
            {timeSlots.map((timeSlot) => (
              <th key={timeSlot} className="min-w-50" />
            ))}
          </tr>
        </thead>
        <tbody>
          {daysWithEntries.map((day, dayIndex) => (
            <tr key={day}>
              <td className="px-6 py-2.5 text-base font-mono font-semibold text-zinc-900 bg-zinc-50/50">
                {day.slice(0, 3).toUpperCase()}
              </td>
              {timeSlots.map((timeSlot) => {
                const entry = scheduleMatrix[day][timeSlot];

                if (entry === "break") {
                  if (dayIndex === 0) {
                    return (
                      <td
                        key={`${day}-${timeSlot}`}
                        rowSpan={daysWithEntries.length}
                        className="bg-amber-100 align-middle rounded-[10px]"
                      >
                        <div className="flex items-center justify-center h-full min-h-25">
                          <div className="flex flex-col items-center justify-center text-amber-600">
                            <p className="text-base font-medium">
                              {breakLabels[timeSlot]}
                            </p>
                            <p className="text-sm font-medium">{timeSlot}</p>
                          </div>
                        </div>
                      </td>
                    );
                  } else {
                    return null;
                  }
                }

                return (
                  <td key={`${day}-${timeSlot}`} className="p-1.5">
                    {entry && (
                      <div className="group relative">
                        <div className="bg-green-50 border border-green-200 rounded-[10px] py-2.5 px-3">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-zinc-900 text-base">
                              {entry.course?.name || "Course"}
                            </p>
                            <p className="text-sm font-semibold text-white bg-green-600 px-3 rounded-full">
                              {entry.room}
                            </p>
                          </div>
                          <p className="text-sm text-zinc-800">{timeSlot}</p>
                          {entry.teacher && (
                            <p className="text-sm text-zinc-500">
                              {entry.teacher.name || entry.teacher}
                            </p>
                          )}

                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onEditEntry(entry)}
                              className="p-1.5 bg-white text-zinc-800 cursor-pointer hover:text-green-600 hover:border-green-200 hover:bg-green-50 rounded-lg shadow transition-all"
                              title="Edit entry"
                            >
                              <LuPencil size={18} />
                            </button>
                            <button
                              onClick={() => onDeleteEntry(entry)}
                              className="p-1.5 bg-white text-zinc-800 cursor-pointer hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg shadow transition-all"
                              title="Delete entry"
                            >
                              <LuTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
