import { axios } from "../lib/axios";

export const fetchAllStudents = async () => {
  const { data } = await axios.get("/users?role=student");
  return data;
};

export const fetchUser = async (id) => {
  const { data } = await axios.get(`/users/${id}`);
  return data;
};

export const createUser = async (data) => {
  const res = await axios.post("/users", data);
  return res?.data;
};

export const editUser = async ({ data, id }) => {
  const res = await axios.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const { data } = await axios.delete(`users/${id}`);
  return data;
};

export const toggleUser = async (id) => {
  const { data } = await axios.patch(`users/toggle/${id}`);
  return data;
};
