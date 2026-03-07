import { axios } from "../lib/axios";

export const fetchAllSchedules = async () => {
  const { data } = await axios.get("/schedules");
  return data;
};

export const fetchSchedule = async (id) => {
  const { data } = await axios.get(`/schedules/${id}`);
  return data;
};

export const fetchScheduleByClass = async (classId) => {
  const { data } = await axios.get(`/schedules/class/${classId}`);
  return data;
};

export const createSchedule = async (payload) => {
  const { data } = await axios.post("/schedules", payload);
  return data;
};

export const updateSchedule = async ({ id, data: payload }) => {
  const { data } = await axios.patch(`/schedules/${id}`, payload);
  return data;
};

export const deleteSchedule = async (id) => {
  const { data } = await axios.delete(`/schedules/${id}`);
  return data;
};

export const addScheduleEntry = async (scheduleId, payload) => {
  const { data } = await axios.post(
    `/schedules/${scheduleId}/entries`,
    payload,
  );
  return data;
};

export const updateScheduleEntry = async ({
  scheduleId,
  entryId,
  data: payload,
}) => {
  const { data } = await axios.patch(
    `/schedules/${scheduleId}/entries/${entryId}`,
    payload,
  );
  return data;
};

export const deleteScheduleEntry = async ({ scheduleId, entryId }) => {
  const { data } = await axios.delete(
    `/schedules/${scheduleId}/entries/${entryId}`,
  );
  return data;
};
