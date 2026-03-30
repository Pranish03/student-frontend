import { isFutureDateLocal, isTodayLocal } from "../../../../utils/formatDate";
import { Alert } from "../../../../components/ui/Alert";

export const AlertStatus = ({
  existingAttendanceId,
  selectedDate,
  isEditing,
}) => {
  const isFutureDate = isFutureDateLocal(selectedDate);
  const isTodayDate = isTodayLocal(selectedDate);

  const getStatusMessage = () => {
    if (isFutureDate) {
      return {
        type: "info",
        message: "Cannot mark attendance for future dates",
      };
    }
    if (!isTodayDate && existingAttendanceId) {
      return {
        type: "info",
        message: "Viewing past attendance record (read-only)",
      };
    }
    if (!isTodayDate && !existingAttendanceId) {
      return {
        type: "warning",
        message: "No attendance record found for this date",
      };
    }
    if (isTodayDate && existingAttendanceId && !isEditing) {
      return {
        type: "success",
        message: "Today's attendance has been marked",
      };
    }
    if (isTodayDate && !existingAttendanceId && isEditing) {
      return {
        type: "info",
        message: "Mark today's attendance for your students",
      };
    }
    return null;
  };

  const status = getStatusMessage();

  if (!status) return null;

  return <Alert variant={status.type}>{status.message}</Alert>;
};
