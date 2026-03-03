import { axios } from "../lib/axios";

export const fetchAllCourses = async () => {
  const { data } = await axios.get("/courses");
  return data;
};

export const fetchCourse = async (id) => {
  const { data } = await axios.get(`/courses/${id}`);
  return data;
};

export const createCourse = async (data) => {
  const res = await axios.post("/courses", data);
  return res?.data;
};

export const editCourse = async ({ data, id }) => {
  const res = await axios.patch(`/courses/${id}`, data);
  return res?.data;
};
