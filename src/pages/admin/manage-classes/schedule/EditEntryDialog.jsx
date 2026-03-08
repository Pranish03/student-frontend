import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../../../components/Dialog";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import {
  daysOfWeek,
  updateTimeTableEntrySchema,
} from "../../../../schemas/scheduleSchema";
import { fetchAllCourses } from "../../../../api/manageCourses";
import {
  fetchScheduleByClass,
  updateScheduleEntry,
} from "../../../../api/manageSchedule";

export const EditEntryDialog = ({ classData, entry, close }) => {
  const queryClient = useQueryClient();

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchAllCourses,
  });

  const { data: scheduleData } = useQuery({
    queryKey: ["schedule", classData?._id],
    queryFn: () => fetchScheduleByClass(classData?._id),
  });

  const schedule = scheduleData?.data;
  const courses = coursesData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(updateTimeTableEntrySchema),
    defaultValues: {
      course: "",
      day: "Monday",
      startTime: "",
      endTime: "",
      room: "TBD",
    },
  });

  useEffect(() => {
    if (entry) {
      setValue("course", entry.course._id || entry.course);
      setValue("day", entry.day);
      setValue("startTime", entry.startTime);
      setValue("endTime", entry.endTime);
      setValue("room", entry.room);
    }
  }, [entry, setValue]);

  const mutation = useMutation({
    mutationFn: updateScheduleEntry,
    onSuccess: (data) => {
      toast.success(data?.message || "Entry updated successfully");
      queryClient.invalidateQueries({ queryKey: ["schedule", classData?._id] });
      close();
    },
  });

  const onSubmit = (data) =>
    mutation.mutate({ scheduleId: schedule._id, entryId: entry._id, data });

  return (
    <Dialog
      heading="Edit Schedule Entry"
      desc="Update the timetable entry"
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mutation?.isError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-base">
              {mutation?.error?.response?.data?.message ||
                "Something went wrong"}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Course *
          </label>
          {coursesLoading ? (
            <div className="flex items-center justify-center py-2">
              <ImSpinner8 className="animate-spin text-zinc-400" />
            </div>
          ) : (
            <select
              {...register("course")}
              className="w-full px-3 py-2 border border-zinc-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          )}
          {errors.course && (
            <p className="text-red-600 text-sm mt-1">{errors.course.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Day *
          </label>
          <select
            {...register("day")}
            className="w-full px-3 py-2 border border-zinc-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {errors.day && (
            <p className="text-red-600 text-sm mt-1">{errors.day.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Start Time *
            </label>
            <Input
              type="time"
              {...register("startTime")}
              placeholder="HH:MM"
              className="w-full"
            />
            {errors.startTime && (
              <p className="text-red-600 text-sm mt-1">
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              End Time *
            </label>
            <Input
              type="time"
              {...register("endTime")}
              placeholder="HH:MM"
              className="w-full"
            />
            {errors.endTime && (
              <p className="text-red-600 text-sm mt-1">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Room
          </label>
          <Input
            type="text"
            {...register("room")}
            placeholder="e.g., Room 101, Lab 2"
            className="w-full"
          />
          {errors.room && (
            <p className="text-red-600 text-sm mt-1">{errors.room.message}</p>
          )}
        </div>

        <div className="flex items-center gap-4 justify-end pt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={close}
            disabled={mutation?.isPending}
          >
            Cancel
          </Button>
          <Button
            className="flex items-center justify-center gap-3 min-w-30"
            type="submit"
            disabled={mutation?.isPending}
          >
            {mutation?.isPending ? (
              <>
                <ImSpinner8 className="animate-spin text-lg" />
                <span>Updating...</span>
              </>
            ) : (
              "Update Entry"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
