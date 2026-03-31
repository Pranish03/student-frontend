import { axios } from "../lib/axios";

export const fetchCourseNotes = async (courseId) => {
  const { data } = await axios.get(`/resources/course/${courseId}`);
  return data;
};

export const createNote = async (data) => {
  const res = await axios.post("/resources", data);
  return res?.data;
};

export const editNote = async ({ id, data }) => {
  const res = await axios.patch(`/resources/${id}`, data);
  return res?.data;
};

export const deleteNote = async (id) => {
  const res = await axios.delete(`/resources/${id}`);
  return res?.data;
};
