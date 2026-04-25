import { axios } from "../lib/axios";

export const fetchAttendanceByCourseAndDate = async (courseId, date) => {
  try {
    const response = await axios.get(`/attendances/${courseId}`, {
      params: { date },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { data: [] };
    }
    throw error;
  }
};

export const createAttendance = async (data) => {
  const response = await axios.post("/attendances", data);
  return response.data;
};

export const updateAttendance = async (attendanceId, data) => {
  const response = await axios.patch(`/attendances/${attendanceId}`, data);
  return response.data;
};
