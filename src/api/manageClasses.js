import { axios } from "../lib/axios";

export const fetchAllClasses = async () => {
  const { data } = await axios.get("/classes");
  return data;
};

export const fetchClass = async (id) => {
  const { data } = await axios.get(`/classes/${id}`);
  return data;
};

export const createClass = async (data) => {
  const res = await axios.post("/classes", data);
  return res?.data;
};

export const editClass = async ({ data, id }) => {
  const res = await axios.patch(`/classes/${id}`, data);
  return res?.data;
};

export const deleteClass = async (id) => {
  const res = await axios.delete(`/classes/${id}`);
  return res?.data;
};
