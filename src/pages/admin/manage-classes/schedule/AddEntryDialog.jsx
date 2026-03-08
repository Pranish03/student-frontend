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
  createTimetableEntrySchema,
  daysOfWeek,
  timeSlots,
} from "../../../../schemas/scheduleSchema";
import {
  fetchScheduleByClass,
  addScheduleEntry,
} from "../../../../api/manageSchedule";
import { Select } from "../../../../components/form/Select";
import { Label } from "../../../../components/form/Label";

export const AddEntryDialog = ({ classData, close }) => {
  const queryClient = useQueryClient();

  const { data: scheduleData } = useQuery({
    queryKey: ["schedule", classData?._id],
    queryFn: () => fetchScheduleByClass(classData?._id),
  });

  const schedule = scheduleData?.data;
  const courses = classData.courses || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(createTimetableEntrySchema),
    defaultValues: {
      course: "",
      day: "Sunday",
      startTime: "",
      endTime: "",
      room: "TBD",
    },
  });

  useEffect(() => {
    reset();
  }, [reset]);

  const mutation = useMutation({
    mutationFn: (data) => addScheduleEntry(schedule._id, data),
    onSuccess: (data) => {
      toast.success(data?.message || "Entry added successfully");
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
    mutation.mutate(data);
  };

  return (
    <Dialog
      heading="Add Schedule Entry"
      desc="Create a new timetable entry"
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
          <Label errors={errors?.course} htmlFor="course" required={true}>
            Course
          </Label>

          {courses.length === 0 ? (
            <div className="py-2 text-zinc-700">
              No course assigned to this class
            </div>
          ) : (
            <Select errors={errors?.course} id="course" {...register("course")}>
              <option value="">Select a course</option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </Select>
          )}
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
          <Label errors={errors?.day} htmlFor="day" required={true}>
            Day
          </Label>

          <Select errors={errors?.day} id="day" {...register("day")}>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>
        </div>

        <div className="hidden">
          <Input
            type="time"
            {...register("startTime")}
            placeholder="HH:MM"
            className="w-full"
          />
          <Input
            type="time"
            {...register("endTime")}
            placeholder="HH:MM"
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="room">Room</Label>

          <Input
            type="text"
            placeholder="e.g., Room 101, Lab 2"
            className="w-full"
            {...register("room")}
            errors={errors?.room}
          />

          {errors?.room && (
            <p className="text-red-600 text-sm mt-1">{errors?.room?.message}</p>
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
                <span>Adding...</span>
              </>
            ) : (
              "Add Entry"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
