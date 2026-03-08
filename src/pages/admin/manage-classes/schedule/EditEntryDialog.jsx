import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../../../components/Dialog";
import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import {
  daysOfWeek,
  timeSlots,
  updateTimeTableEntrySchema,
} from "../../../../schemas/scheduleSchema";
import { updateScheduleEntry } from "../../../../api/manageSchedule";
import { Label } from "../../../../components/form/Label";
import { Select } from "../../../../components/form/Select";

export const EditEntryDialog = ({ classData, entry, scheduleId, close }) => {
  const queryClient = useQueryClient();

  const courses = classData?.courses || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(updateTimeTableEntrySchema),
    defaultValues: {
      course: "",
      day: "Sunday",
      startTime: "",
      endTime: "",
      room: "TBD",
    },
  });

  useEffect(() => {
    if (entry) {
      setValue("course", entry?.course?._id || entry?.course);
      setValue("day", entry?.day);
      setValue("startTime", entry?.startTime);
      setValue("endTime", entry?.endTime);
      setValue("room", entry?.room);
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

  const handleSlotChange = (e) => {
    const slot = timeSlots.find((s) => s.title === e.target.value);

    if (slot) {
      setValue("startTime", slot.startTime);
      setValue("endTime", slot.endTime);
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    mutation.mutate({ scheduleId, entryId: entry?._id, data });
  };

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
          <Label errors={errors?.course} required={true} htmlFor="course">
            Course
          </Label>

          <Select id="course" errors={errors?.course} {...register("course")}>
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name} ({course.code})
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label
            errors={errors?.startTime || errors?.endTime}
            htmlFor="period"
            required={true}
          >
            Period
          </Label>

          <Select
            errors={errors?.startTime || errors?.endTime}
            id="period"
            onChange={handleSlotChange}
          >
            <option value="">Select Period</option>

            {timeSlots.map((slot) => (
              <option key={slot.title} value={slot.title}>
                {slot.title} ({slot.startTime} - {slot.endTime})
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label errors={errors?.day} required={true} htmlFor="day">
            Day
          </Label>

          <Select id="day" errors={errors?.day} {...register("day")}>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label errors={errors?.room} htmlFor="day">
            Room
          </Label>

          <Input
            type="text"
            className="w-full"
            placeholder="e.g., Room 101, Lab 2"
            {...register("room")}
          />
          {errors.room && (
            <p className="text-red-600 text-sm mt-1">{errors.room.message}</p>
          )}
        </div>

        <input type="hidden" {...register("startTime")} />
        <input type="hidden" {...register("endTime")} />

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
