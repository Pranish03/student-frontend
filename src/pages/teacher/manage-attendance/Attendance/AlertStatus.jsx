import { isFutureDateLocal, isTodayLocal } from "../../../../utils/formatDate";
import { Alert } from "../../../../components/ui/Alert";

export const AlertStatus = ({
  existingAttendanceId,
  selectedDate,
  isEditing,
}) => {
  const isFutureDate = isFutureDateLocal(selectedDate);
  const isTodayDate = isTodayLocal(selectedDate);

  const getStatus = () => {
    if (isFutureDate) {
      return {
        type: "info",
        message: "Cannot mark attendance for future dates.",
      };
    }

    if (!isTodayDate && existingAttendanceId) {
      return {
        type: "info",
        message: "Viewing past attendance record (read-only).",
      };
    }

    if (!isTodayDate && !existingAttendanceId) {
      return {
        type: "warning",
        message: "No attendance record found for this date.",
      };
    }

    if (isTodayDate && !existingAttendanceId && !isEditing) {
      return {
        type: "info",
        message:
          'Attendance has not been marked yet for today. Click "Take Attendance" to begin.',
      };
    }

    if (isTodayDate && !existingAttendanceId && isEditing) {
      return {
        type: "info",
        message: "Mark today's attendance for your students.",
      };
    }

    if (isTodayDate && existingAttendanceId && !isEditing) {
      return {
        type: "success",
        message: "Today's attendance has been marked successfully.",
      };
    }

    if (isTodayDate && existingAttendanceId && isEditing) {
      return {
        type: "warning",
        message: "You are editing today's existing attendance record.",
      };
    }

    return null;
  };

  const status = getStatus();
  if (!status) return null;

  return <Alert variant={status.type}>{status.message}</Alert>;
};
