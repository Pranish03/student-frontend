import { axios } from "../lib/axios";

export const fetchAllStudents = async () => {
  const { data } = await axios.get("/users?role=student");
  return data;
};
