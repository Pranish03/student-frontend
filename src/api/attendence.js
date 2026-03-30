import { axios } from "../lib/axios";

export const fetchAttendanceByCourseAndDate = async (courseId, date) => {
  const response = await axios.get(`/attendances/${courseId}`, {
    params: { date },
  });
  return response.data;
};

export const createAttendance = async (data) => {
  const response = await axios.post("/attendances", data);
  return response.data;
};

export const updateAttendance = async (attendanceId, data) => {
  const response = await axios.patch(`/attendances/${attendanceId}`, data);
  return response.data;
};
