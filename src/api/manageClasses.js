import { axios } from "../lib/axios";

export const fetchAllClasses = async () => {
  const { data } = await axios.get("/classes");
  return data;
};

export const createClass = async (data) => {
  const res = await axios.post("/classes", data);
  return res?.data;
};
