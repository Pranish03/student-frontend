import { useQuery } from "@tanstack/react-query";
import { LuClock, LuTrash2, LuLoader, LuCreditCard } from "react-icons/lu";
import { fetchScheduleByClass } from "../../../../api/manageSchedule";
import { daysOfWeek } from "../../../../schemas/scheduleSchema";
import { Button } from "../../../../components/Button";

export const ScheduleGrid = ({
  classData,
  onEditEntry,
  onDeleteEntry,
  onAddSchedule,
}) => {
  const {
    data: scheduleData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schedule", classData?._id],
    queryFn: () => fetchScheduleByClass(classData?._id),
    enabled: !!classData?._id,
  });

  const schedule = scheduleData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LuLoader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-[10px] p-6 text-center">
        <p className="text-red-600">
          Error loading schedule. Please try again.
        </p>
      </div>
    );
  }

  if (!schedule) {
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

  const scheduleByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = schedule?.timeTable?.filter((entry) => entry.day === day) || [];
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {daysOfWeek.map((day) => {
        const entries = scheduleByDay[day];

        if (entries.length === 0) return null;

        return (
          <div
            key={day}
            className="border border-zinc-200 rounded-[10px] overflow-hidden"
          >
            <div className="bg-zinc-50 px-4 py-2 border-b border-zinc-200">
              <h3 className="font-medium text-zinc-900">{day}</h3>
            </div>
            <div className="divide-y divide-zinc-100">
              {entries.map((entry) => (
                <div key={entry._id} className="p-4 hover:bg-zinc-50 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900 mb-1">
                        {entry.course?.name || "Course"}
                      </p>
                      <p className="text-sm text-zinc-600 mb-1">
                        {entry.startTime} - {entry.endTime}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Room: {entry.room}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditEntry(entry)}
                        className="p-1.5 text-zinc-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <LuCreditCard size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteEntry(entry)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {schedule.timeTable?.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-zinc-500">No timetable entries yet</p>
          <p className="text-sm text-zinc-400 mt-1">
            Click "Add Entry" to create your first schedule entry
          </p>
        </div>
      )}
    </div>
  );
};
