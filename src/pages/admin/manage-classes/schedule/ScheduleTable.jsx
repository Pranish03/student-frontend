import {
  LuClock,
  LuTrash2,
  LuLoader,
  LuPencil,
  LuMapPin,
} from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { daysOfWeek } from "../../../../schemas/scheduleSchema";
import { Button } from "../../../../components/Button";

const TIME_SLOTS = [
  { label: "First Period", start: "06:30", end: "08:00" },
  { label: "Break", start: "08:00", end: "08:30" },
  { label: "Second Period", start: "08:30", end: "10:00" },
  { label: "Third Period", start: "10:00", end: "11:30" },
];

const DAY_COLORS = {
  Sunday: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    dot: "bg-rose-400",
  },
  Monday: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  Tuesday: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    dot: "bg-violet-400",
  },
  Wednesday: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  Thursday: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  Friday: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    dot: "bg-cyan-400",
  },
  Saturday: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
};

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
      <div className="border border-red-200 rounded-[10px] p-6 text-center">
        <p className="text-red-600">
          Error loading schedule. Please try again.
        </p>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="text-center py-12">
        <LuClock className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-zinc-900">
          No Schedule Created
        </h3>
        <p className="text-zinc-600 mb-4">
          This class doesn't have a schedule yet.
        </p>
        <Button onClick={onAddSchedule} className="mx-auto">
          Create Schedule
        </Button>
      </div>
    );
  }

  const matrix = {};
  for (const day of daysOfWeek) {
    matrix[day] = {};
    for (const slot of TIME_SLOTS) {
      if (slot.label === "Break") continue;
      const key = `${slot.start}-${slot.end}`;
      const entry = scheduleData?.timeTable?.find(
        (e) =>
          e.day === day && e.startTime === slot.start && e.endTime === slot.end,
      );
      matrix[day][key] = entry ?? null;
    }
  }

  const activeDays = daysOfWeek.filter((day) =>
    TIME_SLOTS.filter((s) => s.label !== "Break").some(
      (slot) => matrix[day][`${slot.start}-${slot.end}`],
    ),
  );

  if (activeDays.length === 0) {
    return (
      <div className="text-center py-12 rounded-[10px]">
        <LuClock className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-zinc-900">No Entries Yet</h3>
        <p className="text-zinc-600 mb-4">
          Add entries to start building the schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 min-w-200">
        <thead>
          <tr>
            <th className="w-28 min-w-28" />
            {TIME_SLOTS.map((slot) => (
              <th key={slot.label} className="text-center pb-3 min-w-44">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {slot.label}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {slot.start} – {slot.end}
                </p>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {activeDays.map((day, dayIndex) => {
            const colors = DAY_COLORS[day];

            return (
              <tr key={day}>
                <td className="pr-2 py-1">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-[10px] bg-zinc-100`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`}
                    />
                    <span className="text-sm font-semibold text-zinc-700">
                      {day.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                </td>

                {TIME_SLOTS.map((slot) => {
                  if (slot.label === "Break") {
                    if (dayIndex === 0) {
                      return (
                        <td
                          key={slot.label}
                          rowSpan={activeDays.length}
                          className="py-1"
                        >
                          <div className="h-full min-h-16 flex flex-col items-center justify-center bg-amber-50 border border-amber-200 rounded-[10px] px-3 py-3">
                            <LuClock
                              size={14}
                              className="text-amber-500 mb-1"
                            />
                            <p className="text-xs font-semibold text-amber-600">
                              Break
                            </p>
                            <p className="text-xs text-amber-500">
                              {slot.start} – {slot.end}
                            </p>
                          </div>
                        </td>
                      );
                    }
                    return null;
                  }

                  const key = `${slot.start}-${slot.end}`;
                  const entry = matrix[day][key];

                  return (
                    <td key={slot.label} className="py-1">
                      {entry ? (
                        <div className="group relative">
                          <div
                            className={`rounded-[10px] border px-3 py-2.5 min-h-16 transition-all
                              ${colors.bg} ${colors.border}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`font-semibold text-sm leading-snug ${colors.text}`}
                              >
                                {entry.course?.name ?? "Course"}
                              </p>
                              {entry.room && entry.room !== "TBD" && (
                                <span
                                  className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 ${colors.text}`}
                                >
                                  {entry.room}
                                </span>
                              )}
                            </div>

                            {entry.course?.code && (
                              <span
                                className={`inline-flex items-center gap-1 text-xs mt-1 font-medium px-1.5 py-0.5 rounded-full bg-white/70 ${colors.text}`}
                              >
                                <BsFileEarmarkCodeFill size={9} />
                                {entry.course.code}
                              </span>
                            )}

                            {entry.teacher && (
                              <p
                                className={`flex items-center gap-1 text-xs mt-1 ${colors.text} opacity-80`}
                              >
                                {entry.teacher.name ?? entry.teacher}
                              </p>
                            )}

                            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onEditEntry(entry)}
                                className="p-1.5 bg-white text-zinc-700 cursor-pointer hover:text-green-600 hover:bg-green-50 rounded-lg shadow transition-all"
                                title="Edit entry"
                              >
                                <LuPencil size={14} />
                              </button>
                              <button
                                onClick={() => onDeleteEntry(entry)}
                                className="p-1.5 bg-white text-zinc-700 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg shadow transition-all"
                                title="Delete entry"
                              >
                                <LuTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="min-h-16 rounded-[10px] border border-dashed border-zinc-200 bg-zinc-50/40" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center gap-4 mt-5 flex-wrap">
        <p className="text-xs text-zinc-400 font-medium">Legend:</p>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-200" />{" "}
          Break
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-3 h-3 rounded-full border border-dashed border-zinc-300" />{" "}
          Free slot
        </span>
      </div>
    </div>
  );
};
